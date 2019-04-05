import * as parseDiff from 'parse-diff'
// parses unified diff
// http://www.gnu.org/software/diffutils/manual/diffutils.html#Unified-Format

export default (input: string) => {
    if (!input) {
        return []
    } else if (input.match(/^\s+$/)) {
        return []
    }

    let lines = input.split('\n')
    if (lines.length === 0) {
        return []
    }

    let files: parseDiff.File[] = []
    let file: parseDiff.File | null = null
    let ln_del = 0
    let ln_add = 0
    let current: parseDiff.Chunk | null = null

    function start(line?: string) {
        file = {
            chunks: [],
            deletions: 0,
            additions: 0
        }

        let fileNames = parseFile(line)
        if (fileNames) {
            file.from = fileNames[0]
            file.to = fileNames[1]
        }

        files.push(file)
    }
    function restart() {
        if (!file || file.chunks.length) {
            start()
        }
    }
    function new_file() {
        restart()
        file!.new = true
        file!.from = '/dev/null'
    }
    function deleted_file() {
        restart()
        file!.deleted = true
        file!.to = '/dev/null'
    }
    function index(line: string) {
        restart()
        file!.index = line.split(' ').slice(1)
    }
    function from_file(line: string) {
        restart()
        file!.from = parseFileFallback(line)
    }
    function to_file(line: string) {
        restart()
        file!.to = parseFileFallback(line)
    }
    function from_file_rename(line: string) {
        restart()
        file!.from = parseFileFallbackRename(line)
    }
    function to_file_rename(line: string) {
        restart()
        file!.to = parseFileFallbackRename(line)
    }
    function chunk(line: string, match: RegExpMatchArray) {
        let newStart, oldStart
        ln_del = oldStart = +match[1]
        let oldLines = +(match[2] || 0)
        ln_add = newStart = +match[3]
        let newLines = +(match[4] || 0)
        current = {
            content: line,
            changes: [],
            oldStart,
            oldLines,
            newStart,
            newLines
        }
        file!.chunks.push(current)
    }
    function del(line: string) {
        if (!current) {
            return
        }
        current.changes.push({
            type: 'del',
            del: true,
            ln: ln_del++,
            content: line
        })
        file!.deletions++
    }
    function add(line: string) {
        if (!current) {
            return
        }
        current.changes.push({
            type: 'add',
            add: true,
            ln: ln_add++,
            content: line
        })
        file!.additions++
    }
    function normal(line: string) {
        if (!current) {
            return
        }
        current.changes.push({
            type: 'normal',
            normal: true,
            ln1: ln_del++,
            ln2: ln_add++,
            content: line
        })
    }
    function eof(line: string) {
        let ref = current!.changes
        let [recentChange] = [].slice.call(ref, -1) as any
        current!.changes.push({
            type: recentChange.type,
            [`${recentChange.type}`]: true,
            ln1: recentChange.ln1,
            ln2: recentChange.ln2,
            ln: recentChange.ln,
            content: line
        } as any)
    }

    type HandlerFunc = (line: string, match?: RegExpMatchArray) => void;
    type SchemaEntry = [RegExp, HandlerFunc];

    const schema = [
        [/^\s+/, normal],
        [/^diff\s/, start],
        [/^new file mode \d+$/, new_file],
        [/^deleted file mode \d+$/, deleted_file],
        [/^index\s[\da-zA-Z]+\.\.[\da-zA-Z]+(\s(\d+))?$/, index],
        [/^---\s/, from_file],
        [/^\+\+\+\s/, to_file],
        [/^rename from\s/, from_file_rename],
        [/^rename to\s/, to_file_rename],
        [/^@@\s+\-(\d+),?(\d+)?\s+\+(\d+),?(\d+)?\s@@/, chunk],
        [/^-/, del],
        [/^\+/, add],
        [/^\\ No newline at end of file$/, eof],
    ] as SchemaEntry[]

    function parse(line: string) {
        for (let [regex, handler] of schema) {
            let m = line.match(regex)
            if (m) {
                handler(line, m)
                return true
            }
        }
        return false
    }

    for (let line of lines) {
        parse(line)
    }
    return files
}

function parseFile(s?: string) {
    if (!s) {
        return
    }

    let fileNames = s.match(/"[ab]\/[^"]*"/g)
    if (fileNames) {
        return fileNames.map(fileName => fileName.slice(3, fileName.length - 1))
    } else {
        return (s.match(/a\/.*(?= b)|b\/.*$/g) || []).map(fileName => fileName.replace(/^(a|b)\//, ''))
    }
}

// fallback function to overwrite file.from and file.to if executed
function parseFileFallback(s: string) {
    s = ltrim(s, '-')
    s = ltrim(s, '+')
    s = s.trim()
    // ignore possible time stamp
    let t = /\t.*|\d{4}-\d\d-\d\d\s\d\d:\d\d:\d\d(.\d+)?\s(\+|-)\d\d\d\d/.exec(s)
    if (t) {
        s = s.substring(0, t.index).trim()
    }
    // ignore git prefixes a/ or b/
    if (s.match(/^(a|b)\//)) {
        return s.substr(2)
    } else {
        return s
    }
}

function parseFileFallbackRename(s: string) {
    let filename: string
    if (s.slice(7).startsWith('from')) {
        filename = s.slice(12)
    } else if (s.slice(7).startsWith('to')) {
        filename = s.slice(10)
    } else {
        return undefined
    }

    if (filename.startsWith('"')) {
        return filename.slice(1, filename.length - 1)
    }
    return filename
}

function ltrim(s: string, chars: string) {
    s = ensureString(s)
    if (!chars && String.prototype.trimLeft) {
        return String.prototype.trimLeft.call(s)
    }
    chars = defaultToWhiteSpace(chars)
    return s.replace(new RegExp('^' + chars + '+'), '')
}

function ensureString(s: any) {
    if (s === null) {
        return ''
    } else {
        return s + ''
    }
}

function defaultToWhiteSpace(chars: string | null) {
    if (chars === null) {
        return '\\s'
    }
    return '[' + escapeRegExp(chars) + ']'
}

function escapeRegExp(s: any) {
    return ensureString(s).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1')
}