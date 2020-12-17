import * as React from 'react';
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { decode } from 'bencodex';
import { Buffer } from 'buffer';
import { BencodexTree } from "./BencodexTree";
import styled from '@emotion/styled';

const BencodexDropzone = styled.div`
    border: 10px dashed silver;
    border-radius: 10px;
    color: gray;
    font-family: sans-serif;
    padding: 10px;
    margin-bottom: 10px;
    &[data-active=active] {
        border-style: solid;
        border-color: gray;
        color: #333;
    }
`;

export const BencodexViewer = () => {
    const [value, setValue] = useState(undefined);
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            file.arrayBuffer().then((aBuffer: ArrayBuffer) => {
                const buffer: Buffer = Buffer.from(aBuffer);
                setValue(decode(buffer));
            });
        }
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop
    });

    return <>
        <BencodexDropzone
            {...getRootProps()}
            data-active={isDragActive ? 'active' : 'inactive'}>

            <input {...getInputProps()} />
            {isDragActive
                ? <p>Drop the Bencodex file&hellip;</p>
                : <p>Drag &amp; drop a Bencodex file here,
                    or click to select a file</p>
            }
        </BencodexDropzone>
        {typeof value == 'undefined'
            ? <></>
            : <BencodexTree value={value} />
        }
    </>;
};
