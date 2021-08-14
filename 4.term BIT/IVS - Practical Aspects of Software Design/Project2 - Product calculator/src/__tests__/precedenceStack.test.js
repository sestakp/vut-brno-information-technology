import {precedenceStack} from "../library/precedenceStack.js";

var tokens = [
    {type: "T_NUM", value: '10.10'},
    {type: "T_ADD", value: undefined},
    {type: "T_NUM", value: '20'},
    {type: "T_MUL", value: undefined},
    {type: "T_NUM", value: '15'},
]

test('Create stack', () => {

    var stack = new precedenceStack();

    expect(stack._stack.length).toBe(0);
    expect(stack._precedences.length).toBe(0);
});

test('Push to stack', () => {

    var stack = new precedenceStack();

    for (var i = 0; i < tokens.length; i++) {
        stack.Push(tokens[i]);
    }

    for (var i = 0; i < tokens.length; i++) {
        expect(stack._stack[i]).toBe(tokens[i]);
        expect(stack._precedences[i]).toBe(i);
    }
});

test('Reduce stack', () => {

    var stack = new precedenceStack();

    for (var i = 0; i < tokens.length; i++) {
        stack.Push(tokens[i]);
    }

    expect(stack.Reduce()).toBe(1);

    expect(stack._stack.length).toBe(tokens.length);
    expect(stack._precedences.length).toBe(tokens.length - 1);

    for (var i = 0; i < tokens.length - 1; i++) {
        expect(stack._stack[i]).toBe(tokens[i]);
        expect(stack._precedences[i]).toBe(i);
    }

    expect(stack._stack[stack._stack.length - 1]).toEqual(stack.e_token);

});

test('LastTerminal index in stack', () => {

    var stack = new precedenceStack();

    for (var i = 0; i < tokens.length; i++) {
        stack.Push(tokens[i]);
    }

    stack.Reduce();

    expect(stack._Last_terminal_pos()).toBe(3);

});

test('LastTerminal in stack', () => {

    var stack = new precedenceStack();

    for (var i = 0; i < tokens.length; i++) {
        stack.Push(tokens[i]);
    }

    stack.Reduce();

    expect(stack.Last_terminal()).toBe(tokens[3]);

});

test('LastPrecedence in stack position', () => {

    var stack = new precedenceStack();

    stack.Push(tokens[0]);
    stack.Reduce();
    stack.Push(tokens[1]);
    stack.Reduce();
    stack.Push(tokens[2]);

    expect(stack._Last_precedence_pos()).toBe(0);

});

test('Get Compare part', () => {

    var stack = new precedenceStack();

    stack.Push(tokens[0]);
    stack.Reduce();
    stack.Push(tokens[1]);
    stack.Push(tokens[2]);
    stack.Reduce();

    expect(stack.Compare_part()).toEqual([
        stack.e_token, tokens[1], stack.e_token
    ]);

});