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
        console.log('here')
        return node.getAttribute('img')
    }

    static formats(node: any){
        console.log('here')
        console.log(node)
        return node.getAttribute('img').length > 0
    }
}
ImageBlot.tagName = 'img'
ImageBlot.blotName = 'conscience-image'
ImageBlot.className='conscience-image'
export { ImageBlot }

const Inline = Quill.import('blots/inline')
class FileLink extends Inline {
    static create(file: string) {
        const node = super.create()
        node.onclick=(e: Event)=>{
            e.preventDefault()
            FileLink.onClick(file)
        }
        node.setAttribute('href', '#')
        node.setAttribute("style", "color: red; text-decoration: underline;")
        return node
    }

    static formats(node: any){
        return node.innerHTML
    }
}
FileLink.tagName = 'A'
FileLink.blotName = 'conscience-file'
FileLink.className='conscience-file'
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
            <select className="ql-align" defaultValue={""} onChange={e => e.persist()}>
                <option selected></option>
                <option value="center"></option>
                <option value="right"></option>
            </select>
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