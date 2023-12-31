import React, { RefObject, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../compontents/Loading/Loading";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import toast from "react-hot-toast";

import "./Embeds.scss";

export default () => {
    const { id } = useParams();

    const title = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLTextAreaElement>(null);
    const color = useRef<HTMLInputElement>(null);
    const footer = useRef<HTMLInputElement>(null);
    const thumbnail = useRef<HTMLInputElement>(null);
    const image = useRef<HTMLInputElement>(null);
    const [list, setList] = useState<{
        name: string,
        value: string,
        inline: boolean,
    }[]>([]);
    const [isLoading, setLoading] = useState(true);

    useDocumentTitle("Edytor embedów");

    useEffect(() => {
        fetch(`/api/embeds/${id}`)
            .then((x) => x.json())
            .then((json) => {
                if (json.code !== 200) throw new Error(`Invalid response: ${JSON.stringify(json)}`);
                setLoading(false);
            })
            .catch((err) => {
                toast.error("Wystąpił błąd po stronie serwera!", { duration: 5000 });
                console.error(err);
            });
    }, []);

    const handleSubmit = () => {
        const data = {
            title: title.current?.value,
            description: description.current?.value,
            color: color.current?.value,
            footer: footer.current?.value,
            thumbnail: thumbnail.current?.value,
            image: image.current?.value,
            fields: list,
        };

        fetch(`/api/embeds/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((x) => x.json())
            .then((json) => {
                if (json.code !== 200) throw new Error(`Invalid response: ${JSON.stringify(json)}`);
                toast.success("Embed został wysłany!", { duration: 5000 });
            })
            .catch((err) => {
                toast.error("Wystąpił błąd po stronie serwera!", { duration: 5000 });
                console.error(err);
            });
    };

    const addField = () => {
        setList([ ...list, { name: "", value: "", inline: false } ]);
    };

    const editField = (index: number, field: "title" | "value" | "inline", value: string | boolean) => {
        const listCopy = list;
        if (!listCopy[index]) return;
        // @ts-ignore
        listCopy[index][field] = value;
    }

    const removeField = (index: number) => {
        const listCopy = list;
        if (!listCopy[index]) return;
        listCopy.splice(index, 1);
        setList([ ...listCopy ]);
    }

    const EmbedEditor = () =>
        <div id="embed-editor">
            <div id="embed-editor-panes">
                <div className="pane">
                    <h1>Ustawienia</h1>
                    <div className="embed-editor-input">
                        <p>Tytuł</p>
                        <input type="text" value={title.current?.value} ref={title} />
                    </div>
                    <div className="embed-editor-input">
                        <p>Opis</p>
                        <textarea id="description" value={description.current?.value} ref={description} />
                    </div>
                    <div className="embed-editor-input">
                        <p>Kolor</p>
                        <input type="color" ref={color} value={color.current?.value} defaultValue="#feff2f" />
                    </div>
                    <div className="embed-editor-input">
                        <p>Miniaturka</p>
                        <input type="text" value={thumbnail.current?.value} ref={thumbnail} />
                    </div>
                    <div className="embed-editor-input">
                        <p>Obrazek</p>
                        <input type="text" value={image.current?.value} ref={image} />
                    </div>
                    <div className="embed-editor-input">
                        <p>Stopka</p>
                        <input type="text" value={footer.current?.value} ref={footer} />
                    </div>
                </div>
                <div className="pane">
                    <h1>Fieldy</h1>
                    <div className="embed-editor-input">
                        <p>Maksymalna ilość to 25</p>
                        <button onClick={addField}>Dodaj</button>
                    </div>
                    <div id="embed-fields">
                    {list.map((field, i) =>
                        <div className="field">
                            <div className="embed-editor-input">
                                <p>Tytuł</p>
                                <input type="text" defaultValue={field.name} onChange={(e) => editField(i, "title", e.target.value)} />
                            </div>
                            <div className="embed-editor-input">
                                <p>Wartość</p>
                                <input type="text" defaultValue={field.value} onChange={(e) => editField(i, "value", e.target.value)} />
                            </div>
                            <div className="embed-editor-input">
                                <p>Inline</p>
                                <input type="checkbox" defaultChecked={field.inline} onChange={(e) => editField(i, "inline", e.target.value == "on" ? true : false)} />
                            </div>
                            <button onClick={() => removeField(i)}>Usuń pole</button>
                        </div>
                    )}
                    </div>
                </div>
            </div>
            <div id="embed-editor-footer">
                <button onClick={handleSubmit}>Wyślij</button>
            </div>
        </div>

    return (
        <div id="embeds-container">
            <div id="embeds-head">
                <h1>Edytor embedów</h1>
            </div>
            { isLoading ? <Loading /> : <EmbedEditor /> }
        </div>
    );
}