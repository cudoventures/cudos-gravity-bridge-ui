import PageComponent, { PageComponentProps } from '../../../../common/js/components-pages/PageComponent';

export interface ContextPageComponentProps extends PageComponentProps {
}

export default class ContextPageComponent < Pr extends ContextPageComponentProps, St = {}, SS = any > extends PageComponent < Pr, St, SS > {

}
