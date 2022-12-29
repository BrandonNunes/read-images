import {ChangeEvent, useState, useEffect} from 'react';
import './App.css';
import { createWorker } from 'tesseract.js';
// @ts-ignore
import * as vintagejs from 'vintagejs'
// import Tesseract from 'tesseract.js';

function App() {
    const [ imageSelected, setImageSelected ] = useState<string|undefined>(undefined)
    const [ textValue, setTextValue ] = useState<string|undefined>(undefined)
    const [ progress, setProgress ] = useState<number>(0)
    const worker = createWorker({
        logger: m => {
            console.log(m)
            setProgress(Math.floor(m.progress * 100))
        }
    });
    function setVintage(imUrl?: any){
        vintagejs(imUrl, {
            brightness: 2.3,
            saturation: 0,
            contrast: 1.0,
            vignette: 0,04
            [ 3]
            lighten: 0,
            sepia: false,
            gray: false,
        })
            .then((res: any) => {
                setImageSelected(res.getDataURL());
                 recognizeImage(res.getDataURL())
            });

    }
    function getImage(e: ChangeEvent<HTMLInputElement>) {
        console.log(e.target.files![0])
        let file = e.target.files![0]
        const reader = new FileReader()
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImageSelected(reader.result as string)
            setVintage(reader.result)
          //  if (reader.result) recognizeImage(reader.result)

        }
       // recognizeImage()
    }
    async function recognizeImage(image?: any) {
        await worker.load();
        await worker.loadLanguage('eng+por');
        await worker.initialize('eng+por');
        const { data: { text, lines } } = await worker.recognize(`${image}`);
        console.log(text);
        console.log(lines)
        setTextValue(text)
        await worker.terminate();
    }
    useEffect(() => {
        if (imageSelected) {
            setVintage(imageSelected)
        }
    }, [imageSelected])

  return (
    <div className="container">
        {imageSelected ? <img width={200} src={imageSelected}/> : ''}
        <input type="file" onChange={(e) => getImage(e)} />
        {progress > 0 ? <small>Progresso: {progress + '%'}</small>: ''}
        {textValue ? <textarea value={textValue} readOnly style={{minHeight: '150px', overflowY: 'scroll'}}></textarea> : ''}

    </div>
  )
}

export default App
