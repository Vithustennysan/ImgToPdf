import { useState } from 'react';
import './App.css'
import { jsPDF } from "jspdf";

function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [pdfName, setPdfName] = useState("");

    const handleImageChange = (event) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files).map((file) =>
                URL.createObjectURL(file)
            );
            setSelectedImages((prevImages) => prevImages.concat(filesArray));
            Array.from(event.target.files).map((file) => URL.revokeObjectURL(file));
        }
    };

    const createPdf = () => {
        const pdf = new jsPDF();
        selectedImages.forEach((image, index) => {
            if (index > 0) pdf.addPage();
            pdf.addImage(image, 'JPEG', 5, 5, 200, 287);
        });
        pdf.save(pdfName + ".pdf");
    };

    const handleChange = (e) => {
      setPdfName(e.target.value);
    }

    const handleRemove = (index) => {
      const newArray = selectedImages.filter((_,i)=> i!== index);
      setSelectedImages(newArray);
    }

    const moveUp = (index) => {
      const newArray = [...selectedImages];
      if (index > 0) {
        [newArray[index], newArray[index-1]] = [newArray[index-1], newArray[index]];
      }
      setSelectedImages(newArray);
    }

    const moveDown = (index) => {
      const newArray = [...selectedImages];
      if (index < newArray.length) {
        [newArray[index], newArray[index+1]] = [newArray[index+1], newArray[index]];
      }
      setSelectedImages(newArray);
    }

    return (
        <div className="App">
            <h1>Image to PDF Converter</h1>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            <div className="images">
                {selectedImages.map((image, index) => {
                  return (
                    <div key={index} className='imageContainer'>
                      <img src={image} alt={`img-${index}`} className='image'/>
                      <div className='editable'>
                        <img src="https://cdn-icons-png.flaticon.com/128/13479/13479590.png" alt="" onClick={() => moveUp(index)}/>
                        <img src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png" alt="" onClick={() => handleRemove(index)}/>
                        <img src="https://cdn-icons-png.flaticon.com/128/13479/13479598.png" alt="" onClick={() => moveDown(index)}/>
                      </div>
                    </div>
                    );
                })}
            </div>
            <label htmlFor="pdfName">
              <input type="text" id='pdfName' placeholder='Enter the pdf name' value={pdfName} onChange={handleChange}/>
            </label>
            <button onClick={createPdf}>Convert to PDF</button>
        </div>
    );
};


export default App
