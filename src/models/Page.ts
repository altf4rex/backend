// Имитируют структуру данных и их создание.



export class Page {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date | null;

    constructor(id: string, title: string, content: string){
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = null;
    }

    //логика, связанная с объектом, была инкапсулирована в его классе.

    updated(title: string, content: string): void {
        this.title = title;
        this.content = content;
        this.updatedAt = new Date();
    }

    toJSON(): Record<string, unknown>{
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            createdAt: this.createdAt,
        }
    }

    validate(): boolean {
        if(!this.title || !this.content){
            throw new Error("Title and content are required")
        }

        return true
    }

}