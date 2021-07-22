import Page from '../pages/Page';
import PageDashboard from '../pages/cadmin/dashboard/PageDashboard';
import PageUsers from '../pages/cadmin/users/PageUsers';
import PageProjects from '../pages/cadmin/projects/PageProjects';
import PageCampaigns from '../pages/cadmin/campaigns/PageCampaigns';
import PageTasks from '../pages/cadmin/tasks/PageTasks';
import Context from '../../utilities/network/Context';

const Config = require('./../../../../config/config');

export default class CAdminFilter {

    static map: Map < string, Page >;

    static init() {
        CAdminFilter.map = new Map();
        CAdminFilter.map.set(Config.URL.CADMIN, new PageDashboard());
        CAdminFilter.map.set(PageDashboard.URL, new PageDashboard());
        CAdminFilter.map.set(PageUsers.URL, new PageUsers());
        CAdminFilter.map.set(PageProjects.URL, new PageProjects());
        CAdminFilter.map.set(PageCampaigns.URL, new PageCampaigns());
        CAdminFilter.map.set(PageTasks.URL, new PageTasks());
    }

    static async onRequest(context: Context) {
        const page = CAdminFilter.map.get(Config.URL.ROOT + context.payload.ctx.URL.pathname);
        if (page === undefined) {
            return false;
        }

        await page.onRequest(context);
        return true;
    }

}
