import React, { useEffect, useState, useRef } from "react";
import Excalidraw, {
  exportToCanvas, exportToSvg, exportToBlob
} from "@excalidraw/excalidraw";
import "./styles.scss";


export default function App() {
  const excalidrawRef = useRef(null);

  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [canvasUrl, setCanvasUrl] = useState(null);
  const [exportWithDarkMode, setExportWithDarkMode] = useState(false);
  const [shouldAddWatermark, setShouldAddWatermark] = useState(false);
  const [theme, setTheme] = useState("light");
  const [lastUpdated, setLastUpdated] = useState(0);

  useEffect(() => {
    const onHashChange = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const libraryUrl = hash.get("addLibrary");
      if (libraryUrl) {
        excalidrawRef.current.importLibrary(libraryUrl, hash.get("token"));
      }
    };
    window.addEventListener("hashchange", onHashChange, false);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }
  , []);

  return (
    <div className="App">
      <h1> Excalidraw Example</h1>
        <div className="button-wrapper">
          <button
            className="reset-scene"
            onClick={() => {
              excalidrawRef.current.resetScene();
            }}
          >
            Reset Scene
          </button>
          <label>
            <input
              type="checkbox"
              checked={viewModeEnabled}
              onChange={() => setViewModeEnabled(!viewModeEnabled)}
            />
            View mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={zenModeEnabled}
              onChange={() => setZenModeEnabled(!zenModeEnabled)}
            />
            Zen mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={gridModeEnabled}
              onChange={() => setGridModeEnabled(!gridModeEnabled)}
            />
            Grid mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => {
                let newTheme = "light";
                if (theme === "light") {
                  newTheme = "dark";
                }
                setTheme(newTheme);
              }}
            />
            Switch to Dark Theme
          </label>
        </div>
        <div className="excalidraw-wrapper">
          <Excalidraw
            ref={excalidrawRef}
            onChange={async (elements, state) =>{
              var d = new Date()
              // console.log("Elements :", elements, "State : ", state) 
              // console.log(d)
              const interval = 10 * 1000;

              if(d.getTime() - lastUpdated >= interval){
                const blob = await exportToBlob({
                  elements: excalidrawRef.current.getSceneElements(),
                  mimeType: "image/png",
                });
                console.log(blob)
                setBlobUrl(window.URL.createObjectURL(blob));
                setLastUpdated(d.getTime())
                if(blobUrl == null){
                  console.log("Blob Url empty")
                  return
                }
                console.log(blobUrl)
                console.log(lastUpdated)
                var filename = blobUrl + '.png'
  
                var formdata = new FormData();
                formdata.append("", blob, filename);
  
                var requestOptions = {
                  method: 'POST',
                  body: formdata,
                  redirect: 'follow'
                };
  
                fetch("http://localhost:8080/upload", requestOptions)
                  .then(response => response.text())
                  .then(result => console.log(result))
                  .catch(error => console.log('error', error));
              }
            }}
            onPointerUpdate={(payload) => console.log(payload)}
            onCollabButtonClick={() =>
              window.alert("You clicked on collab button")
            }
            viewModeEnabled={viewModeEnabled}
            zenModeEnabled={zenModeEnabled}
            gridModeEnabled={gridModeEnabled}
            theme={theme}
            name="Custom name of drawing"
            UIOptions={{ canvasActions: { loadScene: false } }}
          />
        </div>

        <div className="export-wrapper button-wrapper">
          <label className="export-wrapper__checkbox">
            <input
              type="checkbox"
              checked={exportWithDarkMode}
              onChange={() => setExportWithDarkMode(!exportWithDarkMode)}
            />
            Export with dark mode
          </label>
          <label className="export-wrapper__checkbox">
            <input
              type="checkbox"
              checked={shouldAddWatermark}
              onChange={() => setShouldAddWatermark(!shouldAddWatermark)}
            />
            Add Watermark
          </label>
          <button
            onClick={async () => {
              const svg = await exportToSvg({
                elements: excalidrawRef.current.getSceneElements(),
                appState: {
                  exportWithDarkMode,
                  shouldAddWatermark,
                  width: 300,
                  height: 100
                },
                embedScene: true
              });
              document.querySelector(".export-svg").innerHTML = svg.outerHTML;
            }}
          >
            Export to SVG
          </button>
          <div className="export export-svg"></div>

          <button
            onClick={async () => {
              const blob = await exportToBlob({
                elements: excalidrawRef.current.getSceneElements(),
                mimeType: "image/png",
                appState: {
                  exportWithDarkMode,
                  shouldAddWatermark
                }
              });
              setBlobUrl(window.URL.createObjectURL(blob));
            }}
          >
            Export to Blob
          </button>
          <div className="export export-blob">
            <img src={blobUrl} alt="" />
          </div>

          <button
            onClick={async () => {
              const canvas = exportToCanvas({
                elements: excalidrawRef.current.getSceneElements(),
                appState: {
                  exportWithDarkMode,
                  shouldAddWatermark
                }
              });
              const ctx = canvas.getContext("2d");
              ctx.font = "30px Virgil";
              // ctx.strokeText("My custom text", 50, 60);
              setCanvasUrl(canvas.toDataURL());
          
            }}
          >
            Export to Canvas
          </button>
          <div className="export export-canvas">
            <img src={canvasUrl} alt="" />
          </div>
        </div>
    </div>
  );
}
