#!/usr/bin/swipl

/**
 * Read all lines from stream
 *
 * @param +Stream opened file stream.
 * @param -Lines Output parameter with lines from stream.
 */
% read_lines(+Stream,-Lines)
read_lines(Stream,Lines) :-
    read_line_to_codes(Stream, Line),
    (Line == end_of_file
    -> (Lines = [])
    ;  (
        read_lines(Stream, Rest),
        atom_codes(Atom, Line),
        Lines = [Atom|Rest]
    )
    ).

/**
 * Split list of strings to list of strings and string
 *
 * @param +Input opened file stream.
 * @param -InputWithoutLastLine Input without last line which represent input tape for Turing machine.
 * @param -LastLine Input tape for Turing machine.
 */
% splitInput(+Input,-InputWithoutLastLine, -LastLine)
splitInput([X], [], X).
splitInput([X|Xs], [X|Rest], Last) :- splitInput(Xs, Rest, Last).

/**
 * Load rules into prolog database and input tape from file
 *
 * @param +File filename to open.
 * @param -Input Input tape for Turing machine.
 */
% load_file_rules_input(+File,-Input)
load_file_rules_input(File, Input) :-
    open(File, read, Stream),
    read_lines(Stream, Lines),
    splitInput(Lines, Rules, Input),
    parse_rules(Rules),
    close(Stream).


/**
 * Store rules into prolog database via assert
 *
 * @param +File filename to open.
 * @param -Input Input tape for Turing machine.
 */
% parse_rules(+Rules)
parse_rules([]).
parse_rules([Rule|Rest]) :- 
    sub_atom(Rule, 0, 1, _, CurrentState),
    sub_atom(Rule, 2, 1, _, CurrentSymbol),
    sub_atom(Rule, 4, 1, _, NewState),
    sub_atom(Rule, 6, 1, _, NewSymbol),
    assert(rule(CurrentState, CurrentSymbol, NewState, NewSymbol)),
    parse_rules(Rest).

/**
 * Replace char in string on specific position
 *
 * @param +String String where char will be replaced
 * @param +Index Position of replace
 * @param +NewChar This char will be placed on current position
 * @param -NewString Transformed string
 */
% replace_char_at(+String, +Index, +NewChar, -NewString)
replace_char_at(String, 0, NewChar, NewString) :-
    sub_atom(String, 1, _, 0, Suffix),
    atom_concat(NewChar, Suffix, NewString).

replace_char_at(String, Index, NewChar, NewString) :-
    Index >= 1,
    sub_atom(String, 0, Index, _, Prefix),
    EndIndex is Index + 1,
    sub_atom(String, EndIndex, _, 0, Suffix),
    NewIndex is Index - 1,
    sub_atom(String, NewIndex, 1, _, _),
    atom_concat(Prefix, NewChar, Temp),
    atom_concat(Temp, Suffix, NewString).

/**
 * Construct string, which represent turing state in current step
 *
 * @param +HeadPos Position of head
 * @param +Input Input tape
 * @param +State Turing machine state
 * @param -Result Transformed string
 */
print_turing_machine_state(HeadPos, Input, State, Result) :-
    sub_atom(Input, 0, HeadPos, _, Prefix),
    sub_atom(Input, HeadPos, _, 0, Suffix),
    atom_concat(Prefix, State, Temp),
    atom_concat(Temp, Suffix, Result).

/**
 * This function simulate turing machine
 *
 * @param +Input Turing machine tape
 * @param -Configuration List of configurations
 * @param +HeadPos Head position of TM
 * @param +State Current state of TM
 * @param +Steps Number of steps - its used to prevent infinite runs
 */
turing_machine_step(_, _, -1, _, _) :- format("~s", [ "The Turing machine stopped abnormally. Access to position -1"]),nl, !,  fail.
turing_machine_step(_, _, _, _, 0) :- format("~s", [ "The Turing machine stopped abnormally. Lot of steps"]),nl, !,  fail.
turing_machine_step(Input, [Conf], HeadPos, State, _) :- State == 'F', print_turing_machine_state(HeadPos, Input, State, Conf).

turing_machine_step(Input, [Conf|Rest], HeadPos, State, Steps) :-
    sub_atom(Input, HeadPos, 1, _, CurSymbol),
    rule(State, CurSymbol, NewState, NewSymbol),
    print_turing_machine_state(HeadPos, Input, State, Conf),
    NewSteps is Steps - 1,
    (NewSymbol == 'L' -> (
        NewHeadPos is HeadPos - 1,
        turing_machine_step(Input, Rest, NewHeadPos, NewState, NewSteps)
    );(
        NewSymbol == 'R' -> (
            NewHeadPos is HeadPos + 1,
            turing_machine_step(Input, Rest, NewHeadPos, NewState, NewSteps)
        );(
            replace_char_at(Input, HeadPos, NewSymbol, NewInput),
            turing_machine_step(NewInput, Rest, HeadPos, NewState, NewSteps)
        )
    )).    

/**
 * This function fire TM simulation
 *
 * @param +Input Turing machine tape
 * @param -Configuration List of configurations
 */
run_turing_machine(Input, Configuration) :-
    turing_machine_step(Input, Configuration, 0, 'S', 100000).


/**
 * This function print on stdin list of configurations in specific format
 *
 * @param +Configuration List of configurations
 */
print_configuration([]).
print_configuration([H|T]) :- write(H), nl, print_configuration(T).

:- initialization(main).

% Main predicate
main :-
    current_prolog_flag(argv, [File|_]),
    load_file_rules_input(File, Input),
    run_turing_machine(Input, Configuration),
    print_configuration(Configuration),
    halt.