import React from 'react';

import axios from 'axios';
import ReactLoading from 'react-loading';

import './scss/loader.css';

type baseProps = {
    color: string;
    type: 'blank' | 'balls' | 'bars' | 'bubbles' | 'cubes' | 'cylon' | 'spin' | 'spinningBubbles' | 'spokes';
};

type dataProps = baseProps & {
    data: any;
};

type urlProps = baseProps & {
    url: string;
    errorCallback?: (error: any) => void;
};

type props = urlProps | dataProps;

interface state {
    loading: boolean;
    width: number;
    data: any;
    children?: any;
}

class QuickLoader extends React.Component<props, state> {
    static defaultProps = {
        type: 'bars',
    };

    state = {
        loading: true,
        width: window.innerWidth <= 768 ? 35 : 50,
        data: {},
        children: [],
    };

    componentDidUpdate = (prevProps: Readonly<props>): void => {
        if ('data' in this.props && prevProps !== this.props) {
            this.setState({data: this.props.data, loading: false});
        }

        if ('url' in this.props && 'url' in prevProps && prevProps.url !== this.props.url) {
            this.retrieveData(this.props.url);
        }
    };

    componentDidMount = (): void => {
        window.addEventListener('resize', this.responsiveHandler);
        this.retrieveData();
    };

    componentWillUnmount = (): void => {
        window.removeEventListener('resize', this.responsiveHandler);
    };

    retrieveData = (url?: any): void => {
        if ('data' in this.props) {
            this.setState({data: this.props.data, loading: false});
            return;
        }

        axios
            .get(url || this.props.url)
            .then(response => {
                this.setState({
                    loading: false,
                    data: response.data,
                });
            })
            .catch(error => {
                if ('errorCallback' in this.props && this.props.errorCallback) {
                    this.props.errorCallback(error);
                }
            });
    };

    responsiveHandler = (): void => {
        this.setState({width: window.innerWidth <= 768 ? 35 : 50});
    };

    render = (): JSX.Element | JSX.Element[] => {
        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child as React.ReactElement<any>, {
                data: this.state.data,
            });
        });

        return this.state.loading ? (
            <div className="spinner-container">
                <ReactLoading
                    className="react-loading"
                    type={this.props.type}
                    color={this.props.color}
                    width={this.state.width}
                />
            </div>
        ) : (
            children
        );
    };
}

export default QuickLoader;
