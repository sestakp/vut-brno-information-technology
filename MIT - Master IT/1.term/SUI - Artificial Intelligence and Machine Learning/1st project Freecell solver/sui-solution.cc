#include "search-strategies.h"
#include <queue>
#include <stack>
#include <algorithm>
#include <list>
#include <set>
#include "memusage.h"
#include <limits.h> 
#include <bits/stdc++.h>


bool operator==(const SearchState &a, const SearchState &b)
{
	return a.state_ == b.state_;
}

std::vector<SearchAction> BreadthFirstSearch::solve(const SearchState &init_state) 
{
    std::vector<std::tuple<std::shared_ptr<SearchState>, std::shared_ptr<SearchAction>, std::shared_ptr<SearchState>>> transitions;
    std::unordered_set <std::shared_ptr<SearchState>> visited;	
    std::queue<std::shared_ptr<SearchState>> queue;
    
	std::shared_ptr<SearchState> init_search_state(new SearchState(init_state));
    visited.insert(init_search_state);
    queue.push(init_search_state);

	// int max_sec_duration = 5 * 1000000;
	// clock_t begin = clock();

    while (!queue.empty())
    {
        if (getCurrentRSS() > mem_limit_ * 0.95 
			// || double(clock() - begin) > max_sec_duration
			)
				return {};

        std::shared_ptr<SearchState> working_state = queue.front();
		queue.pop();

		if (working_state->isFinal())
		{
    		std::vector<SearchAction> solution;

			while (!(*working_state == *init_search_state))
			{
				auto tpl = std::find_if(transitions.begin(), transitions.end(),
					[working_state](const std::tuple<std::shared_ptr<SearchState>, std::shared_ptr<SearchAction>, std::shared_ptr<SearchState>> val) 
					{
						return *working_state == *std::get<2>(val);
					});

				if (tpl == transitions.end())
				{
					return solution;
				}

				solution.push_back(*std::get<1>(*tpl));
				working_state = std::get<0>(*tpl);
			
			}
			std::reverse(solution.begin(), solution.end());

			return solution;
		}

		for (auto action: working_state->actions())
        {

			std::shared_ptr<SearchState> new_state(std::make_shared<SearchState>(action.execute(*working_state)));

			transitions.push_back(std::make_tuple(working_state, std::make_shared<SearchAction>(action), new_state));
			
			bool existInVisited = (visited.find(new_state) != visited.end());

			if (!existInVisited)
			{
				visited.insert(new_state);
				queue.push(new_state);
			}
        }

    }

	return {};
}


std::vector<SearchAction> DepthFirstSearch::solve(const SearchState &init_state) 
{
    std::vector<std::tuple<std::shared_ptr<SearchState>, std::shared_ptr<SearchAction>, std::shared_ptr<SearchState>>> transitions;
    std::stack<std::pair<std::shared_ptr<SearchState>, int>> stack;
    
	std::shared_ptr<SearchState> init_search_state(new SearchState(init_state));
    
	stack.push(std::make_pair(init_search_state,0));

	// int max_sec_duration = 5 * 1000000;
	// clock_t begin = clock();

	while (!stack.empty())
    {
        if (getCurrentRSS() > mem_limit_ * 0.95 
			// || double(clock() - begin) > max_sec_duration
			)
				return {};

        std::shared_ptr<SearchState> working_state = stack.top().first;
		int currentDepth = stack.top().second;
		stack.pop();

		if (working_state->isFinal())
		{
			std::vector<SearchAction> solution;

			while (!(*working_state == *init_search_state))
			{
				auto tpl = std::find_if(transitions.begin(), transitions.end(),
					[working_state](const std::tuple<std::shared_ptr<SearchState>, std::shared_ptr<SearchAction>, std::shared_ptr<SearchState>> val) {
						return *working_state == *std::get<2>(val);
					});

				if (tpl == transitions.end())
				{
					return solution;
				}
				solution.push_back(*std::get<1>(*tpl));
				working_state = std::get<0>(*tpl);
				
			}
			std::reverse(solution.begin(), solution.end());

			return solution;
		}

		if (currentDepth > this->depth_limit_)
		{
			continue;
		}

		for (auto action:  working_state->actions())
        {
			std::shared_ptr<SearchState> new_state(std::make_shared<SearchState>(action.execute(*working_state)));

			transitions.push_back(std::make_tuple(working_state, std::make_shared<SearchAction>(action), new_state));
		
			stack.push(std::make_pair(new_state, currentDepth + 1));
        }
    }

	return {};
}

// make && ./fc-sui 1 42 --solver a_star --easy-mode 10 --heuristic student
double StudentHeuristic::distanceLowerBound(const GameState &state) const 
{
	// std::vector<double> heuristics;
	int h1 = 0;

	int searched_values[4] = { -1, -1, -1, -1 };
	int searched_colors[4] = { -1, -1, -1, -1 };
	for (int i = 0; i < 4; ++i)
	{
	
		auto top_card = state.homes[i].topCard();
		if (top_card.has_value())
		{
			searched_colors[i] = (int)top_card->color;
			searched_values[i] = top_card->value + 1;
		}
	}

	for (int color_value = 0; color_value < 4; ++color_value)
	{
		bool found = false;
		for (int i = 0; i < 4; ++i)
			if (searched_colors[i] == color_value)
				found = true;	
				
		if (!found)
		{
			int j = 0;
			while (searched_colors[j] != -1) ++j;

			searched_colors[j] = color_value;
			searched_values[j] = 1;
		}
	}


	int foundCardDepth[4] = { -1, -1, -1, -1 };
	// bool any_free_stack = false;
	for (const auto &cascade : state.stacks) 
	{
		auto storage = cascade.storage();
		if(storage.size() > 0)
		{
			for(size_t i = 0; i < storage.size(); ++i)
			{
				auto current_card = storage.at(storage.size() - 1 - i);

				for (int srch_crd_idx = 0; srch_crd_idx < 4; ++srch_crd_idx)
				{
					if (current_card.value == searched_values[srch_crd_idx]
					 	&& (int)current_card.color == searched_colors[srch_crd_idx])
							foundCardDepth[srch_crd_idx] = i;
				}
				
			}
		}
		// else 
		// {
		// 	any_free_stack = true;	
		// }
	}

	for (int i = 0; i < 4; ++i)
		h1 += foundCardDepth[i];

	// bool any_free_free_cell = false;
	// for (auto &free_cell : state.free_cells)
	// 	if (!free_cell.topCard().has_value()) 
	// 		any_free_free_cell = true;
		
	// int h11 = (!any_free_free_cell && !any_free_stack);

	 //h2=NumberWellPlaced Number of well-placed cards in cascade piles
	 double h2 = king_value * colors_list.size();

	  for (const auto &cascade : state.stacks) {

	 	auto storage = cascade.storage();
		
	 	if(storage.size() > 0){

	 		for(size_t i = 0; i < storage.size()-1; i++){

				
	 			if(storage.size() == 1){
	 				h2--;
	 				break;
	 			}	

	 			auto currentCard = storage.at(storage.size() - 1 - i);
	 			auto prevCard = storage.at(storage.size() - 2 - i);

	 			if(currentCard.color != prevCard.color && currentCard.value == prevCard.value -1){
	 				h2--;
	 			}
	 		}
	 	}    
     }

	// //std::cout << "h2: " << h2 << std::endl;
	// heuristics.push_back(h2);

	//h3=NumCardsNotAtFoundations Number of cards not at foundation piles
	double h3 = 0;
	
    for (const auto &cascade : state.stacks) 
	{
        auto numberOfCards = cascade.storage().size();
        h3+= numberOfCards;
    }

	//std::cout << "h3: " << h3 << std::endl;
	// heuristics.push_back(h3);

	// double freeCellAvg = 0.0;

	//h4=FreeCells Number of free FreeCells and cascades
	int h4 = 12;
    for (const auto &free_cell : state.free_cells) 
	{
        auto opt_top = free_cell.topCard();
		// freeCellAvg += opt_top->value;
        if (! opt_top.has_value())
            h4--;
    }
	// freeCellAvg /= state.free_cells.size();

	for(const auto &cascade: state.stacks)
	{
		auto numberOfCards = cascade.storage().size();
		if (numberOfCards == 0)
			h4--;
	}

// 	//std::cout << "h4: " << h4 << std::endl;
// 	heuristics.push_back(h4);

	// //h5=DifferenceFromTop Average value of top cards in cascades minus average value of top cards in foundation
	// //piles
	// double h5 = 0.0;
	// double cascadeAvg = 0.0;
	// double foundationAvg = 0.0;

	// for(const auto &cascade: state.stacks)
	// {
	// 	auto top_card = cascade.topCard();

	// 	if (top_card.has_value())
    //     	cascadeAvg += top_card->value;
	// }
	// cascadeAvg /= state.stacks.size();

	// for(const auto &home: state.homes)
	// {
	// 	auto top_card = home.topCard();

	// 	if (top_card.has_value())
    //     	foundationAvg += top_card->value;
	// }
	// foundationAvg /= state.homes.size();
	// if (foundationAvg > 0)
	// {
	// 	// h5 = cascadeAvg / foundationAvg;
	// 	// h5 = cascadeAvg * 0.2 / foundationAvg;
	// 	// h5 = (freeCellAvg + cascadeAvg) * 0.5 / foundationAvg;
	// 	h5 =  cascadeAvg * 0.5 / foundationAvg;
	// }
	// else
	// {
	// 	h5 = cascadeAvg;
	// }
	

	// std::cout << "h5: " << h5 << std::endl;
	// heuristics.push_back(h5);

	
	double h10 = king_value * colors_list.size();
    for (const auto &home : state.homes) 
	{
        auto opt_top = home.topCard();
        if (opt_top.has_value())
            h10 -= opt_top->value;
    }

	// std::cout << "h10: " << h10 << std::endl;
	// heuristics.push_back(h10);
    
	//std::cout << "heuristic max: " << *std::max_element(heuristics.begin(), heuristics.end()) << std::endl;
    // return *std::max_element(heuristics.begin(), heuristics.end());

	// return h1;
	// return h10 * 0.3 + h1 * 0.7;

	// 70 %
	// return h10 * 1 + h1 * 1 + h5 * 2;

	// 68 %
	// return h10 * 1 + h1 * 1 + h5 * 4;

	// 74 %
	// return h10 * 1 + h1 * 1 + h5 * 3;
	
	// 84%
	//return h10 * 1 + h1 * 1 + h5 * 3 + h3 * 1;

	//94%
	//return h10 * 1 + h1 * 1 + h5 * 1 + h3 * 1 + h2 * 1 ;
	
	// return h10 * 0.4 + h1 * 0.4 + h5 * 0.8 + h3 * 0.4 + h2 * 0.4 ;

	// std::cout << h10 <<", "<< h1 * 2 <<", "<< h5 * 15<<", "<< h3 <<", "<< h2<<"\n";

	// return h10 * 1 + h1 * 1 + h5 * 1 + h3 * 1 + h2 * 1 ;
	// return h10 * 1 + h1 * 1 + h5 * 3;

	// 95 +
	// return h3 * 3 + h10 * 3 + h1 + h2;
	// return h3 * 3 + h10 * 3 + h1 + h2 + h5 * 0.2 + h4 * 0.1;
	// return h3 * 3 + h10 * 3 + h1 + h2 + h5 * 0.2;

	// 97 + 
	return h3 * 3 + h10 * 3 + h1 + h2 + h4 * 0.1;
	// return h3 * 3 + h10 * 3 + h1 + h2;

}

class orderByHeuristic
{
public:
	bool operator() (const std::tuple<std::shared_ptr<SearchState>, double, double>& a, 
					const std::tuple<std::shared_ptr<SearchState>, double, double>& b) const
	{
		return ((std::get<1>(a) + std::get<2>(a)) < (std::get<1>(b) + std::get<2>(b)));
	}
};


struct cmpByHeuristic {
    bool operator()(const std::tuple<double, double, std::shared_ptr<SearchState>>& a, const std::tuple<double, double, std::shared_ptr<SearchState>>& b) const {
        return ((std::get<0>(a) + std::get<1>(a)) > (std::get<0>(b) + std::get<1>(b)));
    }
};

std::vector<SearchAction> AStarSearch::solve(const SearchState &init_state) 
{
	int iter=0;
	//std::cout << "a star solver allocated mem on start: " << getCurrentRSS() << std::endl;
	int max_sec_duration = 3 * 1000000;
	clock_t begin = clock();

    std::vector<std::tuple<std::shared_ptr<SearchState>, std::shared_ptr<SearchAction>, std::shared_ptr<SearchState>>> transitions;
	
	//std::map<std::pair<double, double>, std::shared_ptr<SearchState>, cmpByHeuristic> open;
	std::priority_queue<std::tuple<double, double, std::shared_ptr<SearchState>>,std::vector<std::tuple<double, double, std::shared_ptr<SearchState>>>, cmpByHeuristic> open;
	
	//std::map<std::pair<double, double>, std::shared_ptr<SearchState>> closed;
	
	
	//std::unordered_set<std::shared_ptr<SearchState>> a;
	//std::unordered_set<std::tuple<int, double>> s;
	//std::unordered_set<std::tuple<std::shared_ptr<SearchState>, double, double>> cosed;
	//std::unordered_set<std::tuple<std::shared_ptr<SearchState>, double, double>> csdalosed;
	std::map<std::shared_ptr<SearchState>, std::pair<double, double>> closed;

	std::shared_ptr<SearchState> init_search_state(new SearchState(init_state));
	open.push(std::make_tuple(0.0, std::numeric_limits<double>::max(), init_search_state));

	// int i = 0;
	while (!open.empty())
	{
		//! time check... if over 
		if (double(clock() - begin) > max_sec_duration)
		{
			// std::cout << "taking too much time... killed at: " << double(clock() - begin) / 1000000 << "s\n";
			// std::cout << "FAILED ";
			return {};
		}
		
		if(transitions.size() > 1000000){
			return {};
		}

        if (getCurrentRSS() > mem_limit_ * 0.95){
			
		
			/*
			while(! open.empty()){
				auto topTuple = open.top();
				std::get<2>(topTuple).reset();
				open.pop();
			}

			while(! transitions.empty()){
				auto topTuple = *(transitions.begin());
				std::get<0>(topTuple).reset();
				std::get<1>(topTuple).reset();
				std::get<2>(topTuple).reset();

				transitions.erase(transitions.begin());
			}

			while(! closed.empty()){
				auto topTuple = *(closed.begin());
				closed.erase(closed.begin());
			}*/
			
			return {};
		}

		//open.sort(orderByHeuristic());

		auto topTuple = open.top();
		std::shared_ptr<SearchState> working_state = std::get<2>(topTuple);
		auto currentDepth = std::get<0>(topTuple);
		auto currentHeuristic = std::get<1>(topTuple);
	//	std::cout << "current cost: " << currentDepth + currentHeuristic << std::endl;
		open.pop();

		if (working_state->isFinal())
		{
			std::vector<SearchAction> solution;

			while (!(*working_state == *init_search_state))
			{
				auto tpl = std::find_if(transitions.begin(), transitions.end(),
					[working_state](const std::tuple<std::shared_ptr<SearchState>, std::shared_ptr<SearchAction>, std::shared_ptr<SearchState>> val) {
						return *working_state == *std::get<2>(val);
					});

				if (tpl == transitions.end())
				{
					return solution;
				}

				solution.push_back(*std::get<1>(*tpl));
				working_state = std::get<0>(*tpl);
			}

			std::reverse(solution.begin(), solution.end());

			return solution;
		}
		


        for (auto action: working_state->actions())
		{


			//std::cout << iter <<", "<<transitions.size()<<", "<< closed.size() <<", "<<open.size()<<"\n";


			iter ++;




			std::shared_ptr<SearchState> new_state(std::make_shared<SearchState>(action.execute(*working_state)));

			transitions.push_back(std::make_tuple(working_state, std::make_shared<SearchAction>(action), new_state));
			
			auto h = compute_heuristic(*new_state, *this->heuristic_);
			//std::cout << "calculated h: " << h << std::endl;
			auto g = 1 + currentDepth;

		
			//todo... check if new_state is in open list
			
			///auto openIt = find_if(open.begin(), open.end(),
			//	[new_state](const std::tuple<std::shared_ptr<SearchState>, double, double>& val) -> bool {
			//		return *std::get<0>(val) == *new_state;
			//	});
				
			auto closedIt = closed.find(new_state);

			// auto closedIt = find_if(closed.begin(), closed.end(),
			// 	[new_state](const std::tuple<std::shared_ptr<SearchState>, double, double>& val) -> bool {
			// 		return *std::get<0>(val) == *new_state;
			// 	});


			//auto openIt = std::find_if(open.begin(), open.end(), [new_state](const std::pair<SearchState,double>& p ){ return p.first == new_state; });
			//auto closedIt = std::find_if(closed.begin(), closed.end(), [new_state](const std::pair<SearchState,double>& p ){ return p.first == new_state; });
			
			
			/*if(openIt != open.end())
			{
				if((std::get<1>(*openIt) + std::get<2>(*openIt) > g+h))
				{
					//TODO... update tuple in openData and open, which is priority queue and i cannot access that element :/
					//auto newTuple = std::make_tuple(std::get<0>(*openIt), g,h);

					open.erase(openIt);
					//std::get<1>(*openIt) = g;
					//std::get<2>(*openIt) = h;
					
					//std::cout << "new openIt" << std::get<1>(*openIt) << ", " << std::get<2>(*openIt) << std::endl;
				}
			}
			else*/ if(closedIt != closed.end())
			{
				if(closedIt->second.first + closedIt->second.second <= g+h)
				{
					continue;
				}
				
				//Move node_successor from the CLOSED list to the OPEN list
				open.push(std::make_tuple(g, h,std::get<0>(*closedIt)));
				closed.erase(closedIt);
			}
			else
			{
				open.push(std::make_tuple(g,h,new_state));
			}
			
		}

		closed.insert(std::make_pair(working_state, std::make_pair(currentDepth, currentHeuristic)));
	}

	
	return {};
}
