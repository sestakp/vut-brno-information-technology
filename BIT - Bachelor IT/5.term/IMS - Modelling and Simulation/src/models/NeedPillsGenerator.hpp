
#ifndef NEED_PILLS_TIMER_HPP
#define NEED_PILLS_TIMER_HPP
    
    #include <simlib.h>
    #include "PersonLife.hpp"


    class NeedPillsGenerator : public Event{
        public:
            explicit NeedPillsGenerator(PersonLife *personLife, double meanValue);
            void Behavior() override;
        
        private: 
            double meanValue;
            PersonLife *personLife;
    };


#endif