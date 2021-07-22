import React from 'react';
import S from '../utilities/Main';
import Uploader from '../utilities/Uploader';

interface Props {
    className?: string;
    id: any;
    params: any;
}

export default class UploaderComponent extends React.Component < Props > {

    nodes: any;
    sState: any;
    upload: any | null;

    constructor(props: Props) {
        super(props);

        this.nodes = {
            'input': React.createRef(),
        };

        this.sState = {
            'initedId': null,
        };

        this.uploader = null;
    }

    componentDidMount() {
        this.initUploader();
    }

    componentDidUpdate() {
        this.initUploader();
    }

    componentWillUnmount() {
        this.uploader.disconnect();
    }

    initUploader() {
        if (this.props.id === this.sState.initedId) {
            return;
        }

        if (this.uploader !== null) {
            this.uploader.disconnect();
        }

        const params = Object.assign(this.props.params, {
            'node': this.nodes.input.current,
        });
        this.uploader = Uploader.newInstance(params);
        this.sState.initedId = this.props.id;
    }

    render() {
        return (
            <input ref = { this.nodes.input } className = { this.props.className } type = { 'file' } />
        );
    }

}

UploaderComponent.defaultProps = {
    'className': S.Strings.EMPTY,
};
