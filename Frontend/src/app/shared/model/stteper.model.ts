export class Step{
    text?: string;
    selected?: boolean;
    passed?: boolean;
    gray?: boolean;
    last?: boolean;

    constructor(text: string, selected: boolean, passed: boolean) {
        this.text = text;
        this.selected = selected;
        this.passed = passed;
    }
}