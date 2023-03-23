import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import "./Label.css";

const LabelInputPage = () => {
    const [labels, setLabels] = useState([]);
    const [newLabel, setNewLabel] = useState('');
    const [update, setUpdate] = useState(false);
    const [changedLabel, setChangedLabel] = useState([]);
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');

    useEffect(() => {

        if(sessionStorage.getItem('isLoggedIn') !== 'true') return;

        async function getLabels() {

            const data = {
                name: username
            };

            const res = await fetch("http://localhost:8000/record/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const message = `An error occurred: ${res.statusText}`;
                window.alert(message);
                return;
            }
        
            const response = await res.json();
            setLabels(response.labels);
            console.log(response);
        }

        getLabels();
        setUpdate(false);

    }, [update, username]);

    const logout = () => {
        sessionStorage.setItem('isLoggedIn', false);
        sessionStorage.setItem('username', '');
        navigate('/', {replace: true});
    }

    async function handleAddLabel() {
        const data = { 
            name: username,
            label: newLabel 
        };

        const res = await fetch("http://localhost:8000/record/add", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const message = `An error occurred: ${res.statusText}`;
            window.alert(message);
            return;
        }
        // console.log(res);
        setUpdate(true);
        setNewLabel('');
    }

    async function handleRenameLabel(id, updateLabel) {
        const data = { 
            label: updateLabel 
        };

        const res = await fetch(`http://localhost:8000/update/${username}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        
        if (!res.ok) {
            const message = `An error occurred: ${res.statusText}`;
            window.alert(message);
            return;
        }

        setUpdate(true);
        setChangedLabel([]);
    }

    const handleInputChange = (id, value) => {
        let updatedLabels = labels.map((item, index) => {
            if(index !== id)
                return item;
            else
                return value;
        });
        // console.log(updatedLabels);
        setLabels(updatedLabels);
        setChangedLabel([id, value])
    }

    async function handleDeleteLabel(id) {
        const res = await fetch(`http://localhost:8000/${username}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const message = `An error occurred: ${res.statusText}`;
            window.alert(message);
            return;
        }
        
        // const updatedLabels = labels.filter(label => label._id !== id);
        // setLabels(updatedLabels);
        setUpdate(true);
    }

  return (
    <>
    { (sessionStorage.getItem('isLoggedIn') === 'true') ?
    <div className='labels'>
        <h1 className='label-h1'>My Labels</h1>
        <button className='logout-button' onClick={logout}>Log Out</button>
        {!labels.length ? <h3>You don't have any labels yet</h3> :
            <ul className='label-list'>
            {labels.length && labels.map((item, index) => (
            <li className='label-item' key={index}>

                <input className='label-input' type="text" value={item} onChange={(e) => handleInputChange(index, e.target.value)} />
                
                <button onClick={() => handleDeleteLabel(index)}>Delete</button>
                {   
                    (changedLabel[0] === index) && 
                    <button className='rename' onClick={() => handleRenameLabel(index, changedLabel[1])}>Rename</button>
                }
            </li>
            ))}
            </ul>
        }
        <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
        <button className='add' onClick={handleAddLabel}>Add Label</button>
    </div> : <Navigate replace to='/' />
    } 
    </>
  );
}

export default LabelInputPage;
