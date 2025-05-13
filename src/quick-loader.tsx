import React, {useState, useEffect, ReactNode, JSX, useMemo} from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import './scss/loader.css';

type BaseProps = {
    color: string;
    type?: 'blank' | 'balls' | 'bars' | 'bubbles' | 'cubes' | 'cylon' | 'spin' | 'spinningBubbles' | 'spokes';
    children: ReactNode | ReactNode[];
};

type DataProps<T> = {
    data: T;
};

type UrlProps = {
    url: string;
    errorCallback?: (error: unknown) => void;
};

type Props<T> = (UrlProps | DataProps<T>) & BaseProps;

function QuickLoader<T>({ type = 'bars', color, ...rest }: Props<T>): JSX.Element {
    const [loading, setLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
    const [data, setData] = useState<T | null>(null);

    const width = useMemo(() => (windowWidth <= 768 ? 35 : 50), [windowWidth]);

    const isDataProps = (props: object): props is DataProps<T> => 'data' in props;
    const isUrlProps = (props: object): props is UrlProps => 'url' in props;

    const updateData = () => {
        if (isDataProps(rest)) {
            setData(rest.data);
            setLoading(false);
        } else if (isUrlProps(rest)) {
            retrieveData(rest.url);
        }
    };

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);

        window.addEventListener('resize', handleResize);

        updateData();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        updateData();
    }, [JSON.stringify(rest)]);

    const retrieveData = (url: string) => {
        axios
            .get<T>(url)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                if ('errorCallback' in rest && rest.errorCallback) {
                    rest.errorCallback(error);
                }
            });
    };

    const enhancedChildren = React.Children.map(rest.children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{ data: T|null }>, {...(child.props as object), data});
        }

        return child;
    });

    return loading ? (
        <div className="spinner-container">
            <ReactLoading className="react-loading" type={type} color={color} width={width} />
        </div>
    ) : (
        <>{enhancedChildren}</>
    );
}

export default QuickLoader;
