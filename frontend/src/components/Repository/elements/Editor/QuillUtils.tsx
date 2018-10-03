import React from 'react'
import { Quill } from 'react-quill'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import path from 'path'

const BlockEmbed = Quill.import('blots/block/embed')
class ImageBlot extends BlockEmbed {
    static create(img: string) {
        const node = super.create()
        node.setAttribute('img', img)
        node.setAttribute('src', "file://" + path.join(ImageBlot.folderPath, node.getAttribute('img')))
        return node
    }

    static value(node: any){
        return node.getAttribute('img')
    }
}
ImageBlot.blotName = 'conscience-image'
ImageBlot.tagName = 'img'
ImageBlot.className='inline-image'
export { ImageBlot }

class FileLink extends BlockEmbed {
    static create(file: string) {
        const node = super.create()
        node.setAttribute("href", "#")
        node.innerHTML = file
        node.onclick=()=>FileLink.onClick(file)
        return node
    }

    static value(node: any){
        return node.innerHTML
    }
}
FileLink.blotName = 'conscience-file'
FileLink.tagName = 'a'
export { FileLink }

const FolderButton = () => <span><FolderOpenIcon/></span>
const CustomToolbar = () => (
    <div id="toolbar">
        <span className="ql-formats">
            <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
                <option value="1"></option>
                <option value="2"></option>
                <option selected></option>
            </select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <button className="ql-strike"></button>
            <button className="ql-blockquote"></button>
        </span>
        <span className="ql-formats">
            <button className="ql-file">
                <FolderButton />
            </button>
            <button className="ql-image"></button>
            <button className="ql-link"></button>
            <button className="ql-formula"></button>
        </span>
        <span className="ql-formats">
            <button className="ql-clean"></button>
        </span>
    </div>
)

export { CustomToolbar }