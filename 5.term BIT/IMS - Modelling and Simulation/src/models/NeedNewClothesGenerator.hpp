#ifndef NEED_NEW_CLOTHES_TIMER_HPP
#define NEED_NEW_CLOTHES_TIMER_HPP

    #include <simlib.h>
    #include "PersonLife.hpp"


    class NeedNewClothesGenerator : public Event{
        public:
            explicit NeedNewClothesGenerator(PersonLife *personLife, double meanValue);
            void Behavior() override;
        
        private: 
            double meanValue;
            PersonLife *personLife;
    };


#endif