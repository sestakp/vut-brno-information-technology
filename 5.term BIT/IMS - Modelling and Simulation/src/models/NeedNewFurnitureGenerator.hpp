
#ifndef NEED_NEW_FURNITURE_TIMER_HPP
#define NEED_NEW_FURNITURE_TIMER_HPP
    
   #include <simlib.h>
   #include "PersonLife.hpp"


    class NeedNewFurnitureGenerator : public Event{
        public:
            explicit NeedNewFurnitureGenerator(PersonLife *personLife, double meanValue);
            void Behavior() override;
        
        private: 
            double meanValue;
            PersonLife *personLife;
    };

#endif