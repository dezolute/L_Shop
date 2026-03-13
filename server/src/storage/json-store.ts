import { promises as fs } from 'fs';
import path from 'path';

export class JsonStore<T> {
    private readonly filePath: string;

    constructor(
        filename: string,
        private readonly defaultValue: T,
    ) {
        this.filePath = path.join(process.cwd(), 'data', filename);
    }

    async read(): Promise<T> {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        try {
            const raw = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(raw) as T;
        } catch (error) {
            const err = error as NodeJS.ErrnoException;
            if (err.code === 'ENOENT') {
                await this.write(this.defaultValue);
                return this.defaultValue;
            }
            throw err;
        }
    }

    async write(data: T): Promise<void> {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
}
