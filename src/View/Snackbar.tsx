import * as React from "react";
import { useLocation } from "react-router-dom";

interface SnackbarState {
    snackbar: React.ReactElement | null;
    fab: boolean;
    show: (snackbar: React.ReactElement) => void;
    hide: () => void;
    setFab: () => void;
}

export const SnackbarContext = React.createContext<SnackbarState>({
    snackbar: null,
    fab: false,
    show: () => {
        return;
    },
    hide: () => {
        return;
    },
    setFab: () => {
        return;
    },
});

export const SnackbarProvider: React.FunctionComponent = ({ children }): React.ReactElement => {
    const [snackbar, setSnackbar] = React.useState<React.ReactElement | null>(null);
    const location = useLocation();
    const [fab, setFab] = React.useState<boolean>(false);
    const hide = (): void => {
        setFab(false), setSnackbar(null);
    };
    React.useEffect(() => {
        setFab(false);
    }, [location]);
    React.useEffect(() => {
        if (snackbar === null) {
            return;
        }
        const timer = setTimeout(hide, 500000);
        return () => clearTimeout(timer);
    }, [snackbar]);
    const state = {
        snackbar,
        fab,
        show: setSnackbar,
        hide,
        setFab: () => setFab(true),
    };
    return <SnackbarContext.Provider value={state}>{children}</SnackbarContext.Provider>;
};

interface SnackbarProps {
    text: string;
    action?: { text: string; fn: () => void };
}

export function Snackbar(props: SnackbarProps): React.ReactElement {
    const ctx = React.useContext(SnackbarContext);
    const onClick = (fn: () => void) => () => {
        fn();
        ctx.hide();
    };

    return (
        <div className={"snackbar " + (ctx.fab ? " snackbar--fab" : "")}>
            <div className="snackbar__inner">
                <p className="snackbar__text">{props.text}</p>
                {props.action ? (
                    <button className="snackbar__action" onClick={onClick(props.action.fn)}>
                        {props.action.text}
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export function SnackbarContainer(): React.ReactElement {
    const ctx = React.useContext(SnackbarContext);
    return <>{ctx.snackbar}</>;
}
