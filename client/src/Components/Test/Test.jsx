import React from "react";
import TestStyle from "./Test.module.css";

class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.toggleShow = false;
        this.modal = React.createRef();
        this.Toggle = this.Toggle.bind(this);
    }

    Toggle() {
        this.toggleShow = !this.toggleShow;
        console.log(this.toggleShow);
        if(this.toggleShow){
            this.modal.current.classList.add(TestStyle.mostrar);
        }else{
            this.modal.current.classList.remove(TestStyle.mostrar);
        }
    }

    render() {
        return (
            <div class="container">
                <button type="button" class="btn btn-success btn-rounded" onClick={this.Toggle}>
                    Mostrar
                </button>
                <div className={TestStyle.modal+' modal'} ref={this.modal} tabindex="-1">
                    <div class="modal-dialog">
                        <div className={TestStyle["modal-content"]+" modal-content"}>
                            <div class="modal-header">
                                <h5 class="modal-title">¡Último paso!</h5>
                                <button
                                    type="button"
                                    className={TestStyle.close+" btn-close"}
                                    data-mdb-dismiss="modal"
                                    aria-label="Close"
                                    onClick={this.Toggle}
                                ></button>
                            </div>
                            <div class="modal-body">
                                <p>La música ha terminado, puede ver una previsualización del resultado
                                    o puede exportar directamente el archivo ahora. ¿Qué desea hacer?
                                </p>
                            </div>
                            <div class="modal-footer">
                                <button
                                    type="button"
                                    class="btn btn-secondary btn-rounded"
                                    data-mdb-dismiss="modal"
                                    onClick={this.Toggle}
                                >
                                    Cerrar
                                </button>
                                <button type="button" class="btn btn-success btn-rounded">
                                    Previsualizar
                                </button>
                                <button type="button" class="btn btn-info btn-rounded">
                                    Exportar<i className={TestStyle.icon+" fas fa-download"}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Test;
