import { useEffect, useRef, useState } from 'react';
import './Editor.css';
import codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/duotone-dark.css'
import './theme_importer'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import themelst from './theme'
import run from '../../assests/triangle.png'
import ACTIONS from '../../Action';

const Editor = ({theme, socketRef, roomID, onCodeChange}) => {

    const editorRef = useRef(null);

    const [Theme, setTheme] = useState(localStorage.getItem('Theme') || 'duotone-dark');

    const codeEditor = async () => {
        if (!editorRef.current){
            editorRef.current =codemirror.fromTextArea(document.getElementById('Texteditor'),{
                mode: {name: 'javascript', json:true},
                theme: Theme,
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineWrapping: true,
                viewportMargin: Infinity,
                lineNumbers: true
            });

            editorRef.current.on('change', (instance, changes)=>{
                // console.log(changes)
                const {origin} = changes
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomID,
                        code,
                    });

                }
                // console.log(code)
            })

            // editorRef.current.setValue('console.log("hello siddhesh")')

            editorRef.current.getWrapperElement().style.height = '92.5vh';
        }
       
    }

    useEffect(() => {
        codeEditor() // eslint-disable-next-line
        return () => {
            if (editorRef.current) {
                editorRef.current.toTextArea(); // Converts back to a textarea
                editorRef.current = null; // Reset the ref
            }
        };
    }, [Theme]); 

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.setOption('Theme', Theme); // Update theme when state changes
            localStorage.setItem('Theme', Theme); // Store the theme in LocalStorage
        }
    }, [Theme]); 

    useEffect(()=>{
        if (socketRef.current){
        socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
            if (code !== null){
                editorRef.current.setValue(code)
            }
        })
    }

    // return ()=>{
    //     socketRef.current.off(ACTIONS.CODE_CHANGE)
    // }

    },[socketRef.current])

  return (<div className='editor'>
    <div className="container">
    <select id="myDropdown" value={theme} onChange={(e) => setTheme(e.target.value)} >
    <option value=''>Choose Own Theme -- {localStorage.getItem("Theme")}</option>
  {themelst.map((themeOption) => (
                    <option key={themeOption} value={themeOption}>
                        {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)} {/* Capitalize the first letter */}
                    </option>
                ))}
        
    </select>
    <img src={run} alt="" />

    </div>
 
    <textarea id='Texteditor'></textarea></div>

  )
};

export default Editor
