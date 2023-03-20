import React from "react";
import Styles from "./NotFound.module.css";

class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.contentDOM = React.createRef();
        this.cloak__wrapperDOM = React.createRef();
        this.cloak__container = React.createRef();
        this.cloak = React.createRef();
        this.info = React.createRef();
        this.h1DOM = React.createRef();
        this.pDOM = React.createRef();
        this.aDOM = React.createRef();
    }

    componentDidMount() {
        document.documentElement.classList.add(Styles.root, Styles.todo)
        document.body.classList.add(Styles.body, Styles.todo)
        this.contentDOM.current.classList.add(Styles.content, Styles.todo);
        this.cloak__wrapperDOM.current.classList.add(Styles.cloak__wrapper, Styles.todo);
        this.cloak__container.current.classList.add(Styles.cloak__container, Styles.todo);
        this.cloak.current.classList.add(Styles.cloak, Styles.todo);
        this.info.current.classList.add(Styles.info, "container", Styles.todo);
        this.h1DOM.current.classList.add(Styles.h1, Styles.todo);
        this.pDOM.current.classList.add(Styles.p, Styles.todo);
        this.aDOM.current.classList.add(Styles.a, Styles.todo);
    }

    render() {
        return (
            <div ref={this.contentDOM}>
                <h1 ref={this.h1DOM}>404</h1>
                <div ref={this.cloak__wrapperDOM}>
                    <div ref={this.cloak__container}>
                        <div ref={this.cloak}></div>
                    </div>
                </div>
                <div ref={this.info}>
                    <h2>Página no encontrada</h2>
                    <p ref={this.pDOM}>
                        Aquí no hay nada, deberías regresar a la página	principal.
                        Puedes hacerlo con el botón de abajo.
                    </p>
                    <a
                        ref={this.aDOM}
                        href="/"
                        target="_self"
                        rel="noreferrer noopener"
                    >
                        Home
                    </a>
                </div>
            </div>
        );
    }
}

export default NotFound;
