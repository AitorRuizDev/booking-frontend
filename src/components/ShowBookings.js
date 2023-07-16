import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowBookings = () => {
    var url = 'http://127.0.0.1:8000/api/bookings';
    const [bookings, setBookings] = useState([]);
    const [id, setId] = useState('');
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');
    const [operation, setOperation] = useState(2);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getBookings();
    }, []);

    const getBookings = async () => {
        url = 'http://127.0.0.1:8000/api/bookings';
        const respuesta = await axios.get(url);
        setBookings(respuesta.data);
    }
    
    const openModal = (op, id, status, description) => {
        setStatus('');
        setDescription('');
        setOperation(op);
        setId('');
        if (op === 1) {
            setTitle('Register Booking');
        }
        else if (op === 2) {
            setTitle('Edit Booking');
            setStatus(status);
            setDescription(description);
            setId(id);
        }
        window.setTimeout(function () {
            document.getElementById('status').focus();
        }, 500);
    }
    const validar = () => {
        var parametros;
        var metodo;
        if (status.trim() === '') {
            show_alerta('Write booking status', 'warning');
        }
        else if (description.trim() === '') {
            show_alerta('Write booking description', 'warning');
        }
        else {
            if (operation === 1) {
                parametros = { status: status.trim(), description: description.trim() };
                metodo = 'POST';
            }
            else {
                parametros = { id: id, status: status.trim(), description: description.trim() };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    }
    const enviarSolicitud = async (metodo, parametros) => {
        if(metodo === "POST"){
            await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
                var tipo = respuesta.status;
                var msj = respuesta.data.message;
                show_alerta(msj, tipo = tipo === 200 ? 'success' : 'error');
                if (tipo === 'success') {
                    document.getElementById('btnCerrar').click();
                    getBookings();
                }
            })
                .catch(function (error) {
                    show_alerta('Error in the request', 'error');
                    console.log(error);
                });
        }else{
            url += "/" + parametros.id;
            await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
                var tipo = respuesta.status;
                var msj = respuesta.data.message;
                if (metodo === "DELETE") {
                    msj = respuesta.data;
                }
                show_alerta(msj, tipo = tipo === 200 ? 'success' : 'error');
                if (tipo === "success") {
                    document.getElementById('btnCerrar').click();
                    getBookings();
                }
            })
                .catch(function (error) {
                    show_alerta('Error in the request', 'error');
                    console.log(error);
                });
        }
    }
    const deleteBooking = (id) => {
        setOperation(2);
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: 'Sure to remove the booking ' + id + ' ',
            icon: 'question', text: 'Cannot be reversed',
            showCancelButton: true, confirmButtonText: 'Yes, delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                enviarSolicitud('DELETE', { id: id });
            }
            else {
                show_alerta('The booking was NOT deleted', 'info');
            }
        });
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalBookings'>
                                <i className='fa-solid fa-circle-plus'></i> Add booking
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr><th>ID</th><th>BOOKING</th><th>DESCRIPTION</th><th>ACTIONS</th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {bookings.map((booking, i) => (
                                        <tr key={booking.id}>
                                            <td>{booking.id}</td>
                                            <td>{booking.status}</td>
                                            <td>{booking.description}</td>
                                            <td>
                                                <button onClick={() => openModal(2, booking.id, booking.status, booking.description)}
                                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalBookings'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteBooking(booking.id)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalBookings' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='status' className='form-control' placeholder='Status' value={status}
                                    onChange={(e) => setStatus(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                                <input type='text' id='descripcion' className='form-control' placeholder='Descripción' value={description}
                                    onChange={(e) => setDescription(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Save
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowBookings