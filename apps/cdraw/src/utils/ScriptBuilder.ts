/**
 * ScriptBuilder.ts
 * Utility for generating Corporater Extended Scripts with a fluent API.
 * Handles indentation, headers, and specific object creation patterns.
 * Ported/Standardized from CTools for cDraw.
 */

export class ScriptBuilder {
    private lines: string[] = []
    private indentLevel: number = 0
    private readonly INDENT_STR = '\t' // cDraw uses tabs in existing generator

    constructor(header?: string) {
        if (header) {
            this.addBlockComment(header)
            this.addNewLine()
        }
    }

    /**
     * Adds a raw line of code with current indentation.
     */
    add(line: string): ScriptBuilder {
        this.lines.push(this.getIndent() + line)
        return this
    }

    /**
     * Adds an empty line.
     */
    addNewLine(): ScriptBuilder {
        this.lines.push('')
        return this
    }

    /**
     * Adds a comment line.
     */
    addComment(text: string): ScriptBuilder {
        this.lines.push(`${this.getIndent()}// ${text}`)
        return this
    }

    addBlockComment(text: string): ScriptBuilder {
        this.add('/*')
        text.split('\n').forEach(line => this.add(` * ${line}`))
        this.add(' */')
        return this
    }

    /**
     * Increases indentation level.
     */
    indent(): ScriptBuilder {
        this.indentLevel++
        return this
    }

    /**
     * Decreases indentation level.
     */
    outdent(): ScriptBuilder {
        if (this.indentLevel > 0) this.indentLevel--
        return this
    }

    /**
     * Helper for .add() / .create() calls that assign to a variable (Definition).
     * e.g. varName := context.method(Type, key := value, ...)
     */
    define(
        varName: string,
        context: string,
        method: string,
        type: string,
        props: Record<string, any>
    ): ScriptBuilder {
        const args = [type, this.formatPropsList(props)].filter(Boolean).join(', ')
        this.add(`${varName} := ${context}.${method}(${args})`)
        return this
    }

    /**
     * Helper for void method calls.
     * e.g. context.method(Type, key := value, ...)
     */
    call(
        context: string,
        method: string,
        type: string | null,
        props: Record<string, any>
    ): ScriptBuilder {
        const args = [type, this.formatPropsList(props)].filter(Boolean).join(', ')
        this.add(`${context}.${method}(${args})`)
        return this
    }

    /**
     * Helper for generic expression calls.
     * e.g. context.method(arg1, arg2)
     */
    expression(context: string, method: string, ...args: any[]): ScriptBuilder {
        const argStr = args.map(a => this.formatValue(a)).join(', ')
        this.add(`${context}.${method}(${argStr})`)
        return this
    }

    private getIndent(): string {
        return this.INDENT_STR.repeat(this.indentLevel)
    }

    private formatPropsList(props: Record<string, any>): string {
        return Object.entries(props)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => `${k} := ${this.formatValue(v)}`)
            .join(', ')
    }

    private formatValue(val: any): string {
        // Handle RawValue objects if passed (checking via duck typing or class if exported)
        if (val && typeof val === 'object' && 'value' in val && val.constructor.name === 'RawValue') {
            return val.value
        }
        if (typeof val === 'string') return `'${val.replace(/'/g, "\\'")}'`
        return String(val)
    }

    toString(): string {
        return this.lines.join('\n')
    }
}

// Simple wrapper for raw values
export class RawValue {
    constructor(public value: string) { }
    toString() { return this.value; }
}

export const raw = (str: string) => new RawValue(str);
