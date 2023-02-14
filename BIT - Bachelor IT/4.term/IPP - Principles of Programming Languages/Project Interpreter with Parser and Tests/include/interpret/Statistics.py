class Statistics:
    """
        Calculating statistics for interpreting

        Methods
        -------

        InstructionExecutedIncrement(instruction)
            If its countable instruction, increment counter of executed instructions

        SetStatisticsHot(Instructions)
            Iterate over instructions and pick instruction with higher hot and minimal Order

        SetStatisticsVars(LFStack,TF,GF)
            Recalculate variables on all frames, if its higher then actual max update max

        printStats(file, argc, argv)
            Analyze arguments and print statistics to file

    """
    def __init__(self):
        self.InstructionExecuted = 0
        self.HotInstructionOrder = 0
        self.Vars = 0

    def InstructionExecutedIncrement(self, instruction):
        op = instruction.Opcode
        if op != "LABEL" and op != "DPRINT" and op != "BREAK":
            self.InstructionExecuted += 1   


    def SetStatisticHot(self, instructions):
        hot = 0
        for instruction in instructions:
            if instruction.HotCounter > hot:
                hot = instruction.HotCounter
                self.HotInstructionOrder = instruction.Order

    def SetStatisticVars(self,LFstack,TF,GF):
        varCounter = 0

        if LFstack is not None:
            for LF in LFstack:
                varCounter += len(LF)
        
        if TF is not None:
            varCounter += len(TF)
        
        varCounter += len(GF)
        if varCounter > self.Vars:
            self.Vars = varCounter

    def printStats(self, file, argc,argv):
        with open(file, "w") as file_obj:
            for arg in argv:
                if arg == "--insts":
                    file_obj.write(str(self.InstructionExecuted))
                    file_obj.write("\n")
                if arg == "--hot":
                    file_obj.write(str(self.HotInstructionOrder))
                    file_obj.write("\n")
                if arg == "--vars":
                    file_obj.write(str(self.Vars))
                    file_obj.write("\n")
        