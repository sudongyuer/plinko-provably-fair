"use client"
import {useState} from "react";
import crypto from "crypto";

export default function Home() {
    const [server_seed, setServer_seed] = useState("6ff3c382c792560e083a3aa259b82e4517225467e0ebe47e611c9b02c59c35f8");
    const [client_seed, setClient_seed] = useState("28EWQzItt71i");
    const [nonce, setNonce] = useState("5");
    const [rows, setRows] = useState(8);

    function getRoll() {
        const data = `${client_seed}${nonce}`;
        const hash = crypto
            .createHmac("sha256", server_seed)
            .update(data)
            .digest("hex");
        const step1 = hash.substring(0, 32)
        const step2 = []
        for (let i = 0; i < step1.length; i += 2) {
            step2.push(parseInt(step1.substring(i, i + 2), 16))
        }
        const step3 = step2.map((x) => x % 2 ? Number(0) : Number(1))
        const step4 = step3.slice(0, rows)
        const result = step4.reduce((a, b) => a + b, 0)
        return {
            index: result,
            array: step4
        }
    }

    return (
        <div className="App">
            <h3>Enter the server seed of the games pair</h3>
            <input
                value={server_seed}
                onChange={(e) => setServer_seed(e.target.value)}
            />
            <br/>
            <br/>
            <h3>Enter the client seed of the games pair</h3>
            <input
                value={client_seed}
                onChange={(e) => setClient_seed(e.target.value)}
            />
            <br/>
            <br/>
            <h3>Enter the nonce of the game</h3>
            <input
                value={nonce}
                onChange={(e) => setNonce(e.target.value)}
            />
            <br/>
            <br/>
            <h3>Rows</h3>
            <select name={"rows"} value={rows} onChange={(e) => setRows(Number(e.target.value))}>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
                <option value={11}>11</option>
                <option value={12}>12</option>
                <option value={13}>13</option>
                <option value={14}>14</option>
                <option value={15}>15</option>
                <option value={16}>16</option>
            </select>
            <hr/>
            <h1>Plinko Result</h1>
            <br/>
            <br/>
            {!server_seed ||
            server_seed.length !== 64 ||
            !client_seed ||
            !nonce ||
            !rows ||
            isNaN(Number(nonce)) ? (
                <h3 style={{color: "red"}}>
                    Please enter a client, server seed and nonce and select a row to view this result
                </h3>
            ) : (
                <>
                    <div>
                                        <span> Payout Index: {
                                            getRoll().array.map((val, index) => {
                                                if (index === getRoll().array.length - 1) {
                                                    return <span key={index}>{val + " ="}</span>
                                                }
                                                return <span key={index}>{val + "+"}</span>
                                            })
                                        } {
                                            getRoll().index
                                        }</span>

                    </div>
                    <br/>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap : "10px",
                    }}>
                        {
                            getRoll().array.map((val, index) => {
                                return <span style={{
                                    border: "1px solid black",
                                    borderRadius: "4px",
                                    padding: "10px",
                                    transform: index === getRoll().index ? "translateY(-15px)" : "",
                                    backgroundColor: index === getRoll().index ? "green" : "",
                                }} key={index}>{index}</span>
                            })
                        }
                    </div>
                </>
            )}
        </div>
    );
}
