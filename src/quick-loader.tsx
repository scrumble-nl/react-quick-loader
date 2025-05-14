import React, {JSX, ReactElement, useEffect, useState} from 'react';

import axios from 'axios';
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

const isDataProps = (props: object): props is DataProps<unknown> => 'data' in props;
const isUrlProps = (props: object): props is UrlProps<unknown> => 'url' in props;

const QuickLoader = <T, E>({type = 'bars', color, ...rest}: Props<T, E>): JSX.Element => {
    const [loading, setLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
    const [componentData, setComponentData] = useState<T | null>(null);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Needed since `useEffect` does not provide deep comparison and only does an `Object.is` check
    const {data, url} = {data: null, url: null, ...rest};

    useEffect(() => {
        if (isDataProps(rest)) {
            setComponentData(data);
            setLoading(false);
        } else if (isUrlProps(rest)) {
            const {token, cancel} = axios.CancelToken.source();

            axios
                .get<T>(rest.url, {cancelToken: token})
                .then(response => {
                    setComponentData(response.data);
                    setLoading(false);
                })
                .catch(rest.errorCallback ?? (() => null));

            return cancel;
        }
    }, [rest, data, url]);

    const enhancedChildren = React.Children.map(rest.children, child =>
        React.isValidElement(child)
            ? React.cloneElement(child, {...(child.props as object), data: componentData})
            : child,
    );

    return loading ? (
        <div className="spinner-container">
            <ReactLoading className="react-loading" type={type} color={color} width={windowWidth <= 768 ? 35 : 50} />
        </div>
    ) : (
        <>{enhancedChildren}</>
    );
};

export default QuickLoader;
