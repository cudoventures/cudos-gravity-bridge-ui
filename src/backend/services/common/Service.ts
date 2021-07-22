import RepoFactory from '../../utilities/database/RepoFactory';
import ServicesFactory from './ServicesFactory';

export default class Service {

    servicesFactory: ServicesFactory;
    repoFactory: RepoFactory;

    constructor(servicesFactory: ServicesFactory) {
        this.repoFactory = servicesFactory.repoFactory;
        this.servicesFactory = servicesFactory;
    }

}
