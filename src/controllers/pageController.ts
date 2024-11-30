//Бизнес-логика обработки страниц

import { generateId } from "../../utils/helpers";
import { Page } from "../models/Page";

export class PageController {
    private static pages: Page[] = [];

    static create(title: string, content: string):Page {
        const page = new Page(generateId(), title, content);
        page.validate();
        this.pages.push(page);
        return page;
    }

    static createDefault(): Page {
        const defaultTitle = "Page name";
        const defaultContent = "text";
        return this.create(defaultTitle, defaultContent);
    }

    static getAll(): Pick<Page, "id" | "title">[]{
        return this.pages.map(({id, title}) => ({id, title}))
    }

    static getById(id: string): Page | null {
        return this.pages.find(p => p.id === id) || null
    }

    static update(id: string, title: string, content: string): Page | null {
        const page = this.pages.find(p => p.id === id) || null;
        if(!page) return null;
        page.updated(title, content)
        return page
    }

    static delete(id: string): boolean {
        const index = this.pages.findIndex(p => p.id === id);
        if (index === -1) return false;
        this.pages.splice(index, 1); 
        return true;
    }
}