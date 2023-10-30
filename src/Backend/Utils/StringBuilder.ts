const { EOL } = require('os');

export class StringBuilder {
    private str: string = '';
    private line = '';

    constructor(private spacing: number = 0) {

    }

    appendBuilder(str: StringBuilder) {
        this.appendLine();
        this.str += str.toString();
    }

    append(str: string) {
        this.line += str;
    }

    appendLine(str?: string) {
        if (str) {
            this.append(str);
        }

        if (this.line.length > 0) {
            this.str += this.getSpacing() + this.line;
            this.line = '';
        }

        this.str += EOL;
    }

    appendLineIndent(str: string) {
        this.appendLine(str);
        this.indent();
    }
    dedentAppendLine(str?: string) {
        this.dedent();
        this.appendLine(str);
    }

    indent() {
        this.spacing += 4;
    }

    dedent() {
        this.spacing -= 4;
    }

    remove(length: number) {
        if (this.line.length < length) {
            throw new Error("Not enough chars on the line: " + this.line);
        }

        this.line = this.line.substring(0, -length);
    }

    createIndented(): StringBuilder {
        return new StringBuilder(this.spacing + 4);
    }

    private getSpacing(): string {
        return ''.padEnd(this.spacing, ' ');
    }

    toString() {
        return this.str;
    }
}
