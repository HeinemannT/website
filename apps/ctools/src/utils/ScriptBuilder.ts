/**
 * ScriptBuilder.ts
 * Utility for generating Corporater Extended Scripts with a fluent API.
 * Handles indentation, headers, and specific object creation patterns.
 */

export class RawValue {
    public value: string;
    constructor(value: string) {
        this.value = value;
    }
    toString() { return this.value }
}

export const raw = (str: string) => new RawValue(str)

export class ScriptBuilder {
    private lines: string[] = []
    private indentLevel: number = 0
    private readonly INDENT_STR = '    '

    constructor(header?: string) {
        if (header) {
            this.addComment(header)
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
     * Helper for .create() calls (Server-side object creation).
     * e.g. target.add(Type, loop:='...', ...)
     */
    createObject(
        parentVar: string,
        type: string,
        props: Record<string, any>
    ): ScriptBuilder {
        const propStr = this.formatProps(props)
        this.add(`${parentVar}.add(${type}${propStr})`)
        return this
    }

    /**
     * Helper for .create() calls that assign to a variable.
     * e.g. folder := parent.add(...)
     */
    createObjectVar(
        varName: string,
        parentVar: string,
        type: string,
        props: Record<string, any>
    ): ScriptBuilder {
        const propStr = this.formatProps(props)
        this.add(`${varName} := ${parentVar}.add(${type}${propStr})`)
        return this
    }

    /**
     * Helper for .add() calls (Layout/View object creation).
     * e.g. row_1 := tab_1.add(Container, ...)
     */
    assignAdd(
        targetVar: string,
        parentVar: string,
        type: string,
        props: Record<string, any>
    ): ScriptBuilder {
        const propStr = this.formatProps(props)
        this.add(`${targetVar} := ${parentVar}.add(${type}${propStr})`)
        return this
    }

    /**
     * Helper for simple assignment.
     * e.g. vRoot := t.dashboard
     */
    assign(targetVar: string, value: string): ScriptBuilder {
        this.add(`${targetVar} := ${value}`)
        return this
    }

    /**
     * Helper for generic method calls.
     * e.g. target.change(content := '...')
     */
    callMethod(
        variable: string,
        method: string,
        props: Record<string, any>
    ): ScriptBuilder {
        const propStr = this.formatPropsList(props)
        this.add(`${variable}.${method}(${propStr})`)
        return this
    }

    private getIndent(): string {
        return this.INDENT_STR.repeat(this.indentLevel)
    }

    /**
     * Formats property map into ", key:='value', key2:=123" string
     */
    private formatProps(props: Record<string, any>): string {
        const str = this.formatPropsList(props)
        if (!str) return ''
        return ', ' + str
    }

    /**
     * Formats property map into "key:='value', key2:=123" string w/o leading comma
     */
    private formatPropsList(props: Record<string, any>): string {
        const entries = Object.entries(props).filter(([, v]) => v !== undefined && v !== null && v !== '')
        if (entries.length === 0) return ''

        return entries.map(([k, v]) => {
            if (v instanceof RawValue) return `${k}:=${v.value}`
            if (typeof v === 'string') return `${k}:='${v}'`
            return `${k}:=${v}`
        }).join(', ')
    }

    toString(): string {
        return this.lines.join('\n')
    }
}
