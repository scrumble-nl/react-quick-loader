import React, {JSX, ReactElement, useEffect, useMemo, useState} from 'react';
import axios, {Canceler} from 'axios';
import ReactLoading from 'react-loading';
import './scss/loader.css';

type BaseProps<T> = {
    color: string;
    type?: ReactLoading['props']['type'];
    children: ReactElement<{data: T | null}> | ReactElement<{data: T | null}>[];
};

type DataProps<T> = {
    data: T;
};

type UrlProps<E> = {
    url: string;
    errorCallback?: (error: E) => void;
};

type Props<T, E = unknown> = (UrlProps<E> | DataProps<T>) & BaseProps<T>;

const isDataProps = <T extends any>(props: object): props is DataProps<T> => 'data' in props;
const isUrlProps = <E extends any>(props: object): props is UrlProps<E> => 'url' in props;

function QuickLoader<T, E>({type = 'bars', color, ...rest}: Props<T, E>): JSX.Element {
    const [loading, setLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
    const [data, setData] = useState<T | null>(null);

    const width = useMemo(() => (windowWidth <= 768 ? 35 : 50), [windowWidth]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isDataProps(rest)) {
            setData(rest.data);
            setLoading(false);
        } else if (isUrlProps(rest)) {
            return retrieveData(rest.url, rest.errorCallback);
        }
    }, [JSON.stringify(rest)]);

    const retrieveData = (url: string, errorCallback?: (error: E) => unknown): Canceler => {
        const {token, cancel} = axios.CancelToken.source();

        axios
            .get<T>(url, {cancelToken: token})
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(errorCallback ?? (() => null));

        return cancel;
    };

    const enhancedChildren = React.Children.map(rest.children, child =>
        React.isValidElement(child) ? React.cloneElement(child, {...(child.props as object), data}) : child,
    );

    return loading ? (
        <div className="spinner-container">
            <ReactLoading className="react-loading" type={type} color={color} width={width} />
        </div>
    ) : (
        <>{enhancedChildren}</>
    );
}

export default QuickLoader;
