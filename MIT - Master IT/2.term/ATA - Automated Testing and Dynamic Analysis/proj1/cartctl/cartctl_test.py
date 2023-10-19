
# VUT FIT BRNO
# ATA project 1
# Author: Pavel Sestak
# Year: 2023


import unittest


from cart import Cart, CargoReq, Status as StatusCart
from cartctl import CartCtl, Status as CartCtlStatus
from jarvisenv import *

class CartctlTests(unittest.TestCase):

    def setUp(self):
        """ methor from unittest, to setup environment before each testcase"""
        super().setUp()
        Jarvis.reset_scheduler()

    @staticmethod
    def log(msg: str) -> None:
        """ Simple logging. """
        print(f'  {msg}')

    @staticmethod
    def cart_ctl_request_log(cart_ctl: CartCtl, cargo_req: CargoReq):
        """ This function log into console when cart controller requesting transfer"""
        CartctlTests.log(f'{Jarvis.time()}: Requesting {cargo_req.content} at {cargo_req.src}')
        cart_ctl.request(cargo_req)

    @staticmethod
    def cargo_load_up_log(cart: Cart, cargo_req: CargoReq) -> None:
        """ This function log into console when cargo load up """
        cargo_req.context = "loaded"
        CartctlTests.log(f'{Jarvis.time()}: Cart at {cart.pos}: loading: {cargo_req}')
        CartctlTests.log(f'{cart}')

    @staticmethod
    def cargo_unload_log(cart: Cart, cargo_req: CargoReq) -> None:
        """ This function log into console when cargo is unload """
        cargo_req.context = "unloaded"
        CartctlTests.log(f'{Jarvis.time()}: Cart at {cart.pos}: unloading: {cargo_req}')
        CartctlTests.log(f'{cart}')

    @staticmethod
    def cart_on_move_log(cart: Cart) -> None:
        """ On-move logging. """
        CartctlTests.log(f'{Jarvis.time()}: Cart is moving {cart.pos} -> {cart.data}')
        CartctlTests.log(f'{cart}')

    def create_cargo_on_load_callback(self, station: str):
        def cargo_onload_callback(cart: Cart, cargo_req: CargoReq) -> None:
            CartctlTests.cargo_load_up_log(cart, cargo_req)
            self.assertEqual(cart.pos, station)
            cargo_req.context = "loaded"
        return cargo_onload_callback

    def create_cargo_unload_callback(self, station: str):
        def cargo_onunload_callback(cart: Cart, cargo_req: CargoReq) -> None:
            CartctlTests.cargo_unload_log(cart, cargo_req)
            self.assertEqual(cart.pos, station)
            cargo_req.context = "unloaded"
        return cargo_onunload_callback

    
    def test_happyPath(self):
         
        #This test represent simplest case. It was used for handshake with cart and cartctl interface.
        #This test check correctness of stations where package is loaded and unloaded.

        #This test case cover: 
        #    CEG testcase 1
        
        #arrange
        SLOLS = 4
        CAPACITY = 150
        DEBUG_LVL = 0

        cart = Cart(SLOLS,CAPACITY,DEBUG_LVL)
        cart.onmove = CartctlTests.cart_on_move_log
        cart_ctl = CartCtl(cart, Jarvis)

        # setup cargo to move
        cargo1Weight = 42
        cargo1Time = 10
        cargo1 = CargoReq('B', 'C', cargo1Weight, 'cargo1')

        cargo1.onload = self.create_cargo_on_load_callback('B')
        cargo1.onunload = self.create_cargo_unload_callback('C')


        cargo2Weight = 50
        cargo2Time = 42
        cargo2 = CargoReq('D', 'B', cargo2Weight, 'cargo2')

        cargo2.onload = self.create_cargo_on_load_callback('D')
        cargo2.onunload = self.create_cargo_unload_callback('B')

        Jarvis.plan(cargo1Time, self.cart_ctl_request_log, (cart_ctl, cargo1))
        Jarvis.plan(cargo2Time, self.cart_ctl_request_log, (cart_ctl, cargo2))
        
        #act
        Jarvis.run()

        #assert
        self.assertTrue(cart.empty())
        self.assertEqual(cart.pos, 'B')
        self.assertEqual(StatusCart.Idle, cart.status)


    def test_without_request_to_move_material(self):
        #This test case check behavior of cart when no request is in the system.

        #This test case cover: 
        #    CEG testcase 2

        #arrange
        SLOLS = 4
        CAPACITY = 150
        DEBUG_LVL = 0

        cart = Cart(SLOLS,CAPACITY,DEBUG_LVL)
        cart.onmove = CartctlTests.cart_on_move_log
        cart_ctl = CartCtl(cart, Jarvis)

        initCartPos = cart.pos
        
        #act
        Jarvis.run()

        #assert
        self.assertTrue(cart.empty())
        self.assertEqual(cart.pos, initCartPos)
        self.assertEqual(StatusCart.Idle, cart.status)
        self.assertTrue(cart.data == None)

    
    def test_prio_request(self):
        
        #This test case check behavior of cart when priority request is in the system.

        #This test case cover: 
        #    CEG testcase 3
        #    COMBINE 7
        
        #arrange
        SLOLS = 4
        CAPACITY = 150
        DEBUG_LVL = 0

        cart = Cart(SLOLS,CAPACITY,DEBUG_LVL)
        cart.onmove = CartctlTests.cart_on_move_log
        cart_ctl = CartCtl(cart, Jarvis)
        
        cargo1Weight = 42
        cargo1Time = 10
        cargo1 = CargoReq('B', 'D', cargo1Weight, 'cargo1')
        cargo1.set_priority()
        cargo1.context = "init"

        cargo1.onload = self.create_cargo_on_load_callback('B')
        cargo1.onunload = self.create_cargo_unload_callback('D')

        cargo2Weight = 120
        cargo2Time = 11
        cargo2 = CargoReq('C', 'A', cargo1Weight, 'cargo2')
        cargo2.context = "init"

        def cargo2_onload_callback(cart: Cart, cargo_req: CargoReq) -> None:
            CartctlTests.cargo_load_up_log(cart, cargo_req)
            self.assertEqual(cart.pos, 'C')
            self.assertTrue(cargo_req.prio)
            cargo_req.context = "loaded"

        cargo2.onload = self.create_cargo_on_load_callback('C')
        cargo2.onunload = self.create_cargo_unload_callback('A')
        
        
        Jarvis.plan(cargo1Time, self.cart_ctl_request_log, (cart_ctl, cargo1))
        Jarvis.plan(cargo2Time, self.cart_ctl_request_log, (cart_ctl, cargo2))

        #act
        Jarvis.run()

        #assert
        self.assertTrue(cart.empty())
        self.assertEqual(cargo1.context, "unloaded")
        self.assertTrue(cargo1.prio) #first cargo was set to prio
        self.assertEqual(cargo2.context, "unloaded")
        self.assertTrue(cargo2.prio) #second one was skipped because prio material was loaded, because delay was cargo2 prio too
        self.assertEqual(StatusCart.Idle, cart.status)
    

    def test_prio_cargo_expired(self) -> None:
        #This test case check behavior when prio cargo expired.
        #This test case cover: 
        #    CEG testcase 4

        #arrange
        cart = Cart(1, 150, 0)
        cart.onmove = self.cart_on_move_log

        cart_ctl = CartCtl(cart, Jarvis)

        cargo1 = CargoReq('D', 'B', 50, 'cargo1')
        cargo1.onload = self.cargo_load_up_log
        cargo1.onunload = self.cargo_unload_log

        cargo2 = CargoReq('B', 'C', 50, 'cargo2')
        cargo2.onload = self.cargo_load_up_log
        cargo2.onunload = self.cargo_unload_log

        undeliverCargo = CargoReq('A', 'D', 50, 'undeliverCargo')
        undeliverCargo.onload = self.cargo_load_up_log
        undeliverCargo.onunload = self.cargo_unload_log

        Jarvis.plan(0, self.cart_ctl_request_log, (cart_ctl, cargo1))
        Jarvis.plan(24, self.cart_ctl_request_log, (cart_ctl, cargo2))
        Jarvis.plan(25, self.cart_ctl_request_log, (cart_ctl, undeliverCargo))

        # act
        Jarvis.run()

        # assert
        self.assertEqual(cargo1.context, "unloaded")
        self.assertEqual(cargo2.context, "unloaded")
        self.assertEqual(undeliverCargo.context, None) #this prio request was deleted from queue

    def test_cargo_expired_no_free_slots(self) -> None:
        #This test case check behavior when prio cargo expired.
        #This test case cover: 
        #    CEG testcase 4

        #arrange
        cart = Cart(0, 150, 0)
        cart.onmove = self.cart_on_move_log

        cart_ctl = CartCtl(cart, Jarvis)

        undeliverCargo = CargoReq('A', 'D', 50, 'undeliverCargo')
        undeliverCargo.onload = self.cargo_load_up_log
        undeliverCargo.onunload = self.cargo_unload_log

        Jarvis.plan(25, self.cart_ctl_request_log, (cart_ctl, undeliverCargo))

        # act
        Jarvis.run()

        # assert
        self.assertEqual(undeliverCargo.context, None) #this prio request was deleted from queue

    def test_cargo_expired_no_weight_limit(self) -> None:
        #This test case check behavior when prio cargo expired.
        #This test case cover: 
        #    CEG testcase 4

        #arrange
        cart = Cart(1, 150, 0)
        cart.onmove = self.cart_on_move_log

        cart_ctl = CartCtl(cart, Jarvis)

        undeliverCargo = CargoReq('A', 'D', 200, 'undeliverCargo')
        undeliverCargo.onload = self.cargo_load_up_log
        undeliverCargo.onunload = self.cargo_unload_log

        Jarvis.plan(25, self.cart_ctl_request_log, (cart_ctl, undeliverCargo))

        # act
        Jarvis.run()

        # assert
        self.assertEqual(undeliverCargo.context, None) #this prio request was deleted from queue
    

    def test_combination_1(self):
        #This test case check behavior when prio cargo expired.
        #This test case cover: 
        #    COMBINE 1

        #arrange
        cart = Cart(1, 150, 0)
        cart.onmove = self.cart_on_move_log

        cart_ctl = CartCtl(cart, Jarvis)
        
        cargo1 = CargoReq('C', 'D', 150, 'cargo1')
        cargo1.onload = self.cargo_load_up_log
        cargo1.onunload = self.cargo_unload_log

        cargo2 = CargoReq('A', 'B', 50, 'cargo2')
        cargo2.onload = self.cargo_load_up_log
        cargo2.onunload = self.cargo_unload_log


        Jarvis.plan(25, self.cart_ctl_request_log, (cart_ctl, cargo1))
        Jarvis.plan(50, self.cart_ctl_request_log, (cart_ctl, cargo2))

        #act
        Jarvis.run()
        
        #assert
        self.assertTrue(cart.empty())
        self.assertEqual(cargo1.context, "unloaded")
        self.assertEqual(cargo2.context, "unloaded")

    def test_combination_2(self):
        #This test case check behavior when prio cargo expired.
        #This test case cover: 
        #    COMBINE 2

        #arrange
        cart = Cart(1, 500, 0)
        cart.onmove = self.cart_on_move_log

        cart_ctl = CartCtl(cart, Jarvis)
        
        cargo1 = CargoReq('C', 'A', 150, 'cargo1')
        cargo1.onload = self.cargo_load_up_log
        cargo1.onunload = self.cargo_unload_log

        cargo2 = CargoReq('D', 'B', 50, 'cargo2')
        cargo2.onload = self.cargo_load_up_log
        cargo2.onunload = self.cargo_unload_log
        cargo2.set_priority()


        Jarvis.plan(25, self.cart_ctl_request_log, (cart_ctl, cargo1))
        Jarvis.plan(50, self.cart_ctl_request_log, (cart_ctl, cargo2))

        #act
        Jarvis.run()
        
        #assert
        self.assertTrue(cart.empty())
        self.assertEqual(cargo1.context, "unloaded")
        self.assertEqual(cargo2.context, "unloaded")

    def test_combination_3(self):
        #This test case check behavior when prio cargo expired.
        #This test case cover: 
        #    COMBINE 3

        #arrange
        cart = Cart(2, 50, 0)
        cart.onmove = self.cart_on_move_log

        cart_ctl = CartCtl(cart, Jarvis)
        
        cargo1 = CargoReq('C', 'D', 50, 'cargo1')
        cargo1.onload = self.cargo_load_up_log
        cargo1.onunload = self.cargo_unload_log

        cargo2 = CargoReq('D', 'A', 50, 'cargo2')
        cargo2.onload = self.cargo_load_up_log
        cargo2.onunload = self.cargo_unload_log
        cargo2.set_priority()

        Jarvis.plan(25, self.cart_ctl_request_log, (cart_ctl, cargo1))
        Jarvis.plan(50, self.cart_ctl_request_log, (cart_ctl, cargo2))

        #act
        Jarvis.run()
        
        #assert
        self.assertTrue(cart.empty())
        self.assertEqual(cargo1.context, "unloaded")
        self.assertEqual(cargo2.context, "unloaded")

    def test_combination_4(self):
        #This test case check behavior when prio cargo expired.
        #This test case cover: 
        #    COMBINE 4

        #arrange
        cart = Cart(2, 150, 0)
        cart.onmove = self.cart_on_move_log

        cart_ctl = CartCtl(cart, Jarvis)

        #act
        Jarvis.run()
        
        #assert
        self.assertTrue(cart.empty())


    def test_combination_5(self):
        #This test case check behavior when prio cargo expired.
        #This test case cover: 
        #    COMBINE 5

        #arrange
        cart = Cart(2, 500, 0)
        cart.onmove = self.cart_on_move_log

        cart_ctl = CartCtl(cart, Jarvis)
        
        cargo1 = CargoReq('C', 'D', 150, 'cargo1')
        cargo1.onload = self.cargo_load_up_log
        cargo1.onunload = self.cargo_unload_log

        cargo2 = CargoReq('A', 'B', 50, 'cargo2')
        cargo2.onload = self.cargo_load_up_log
        cargo2.onunload = self.cargo_unload_log


        Jarvis.plan(25, self.cart_ctl_request_log, (cart_ctl, cargo1))
        Jarvis.plan(50, self.cart_ctl_request_log, (cart_ctl, cargo2))

        #act
        Jarvis.run()
        
        #assert
        self.assertTrue(cart.empty())
        self.assertEqual(cargo1.context, "unloaded")
        self.assertEqual(cargo2.context, "unloaded")

    def test_combination_6(self):
        #This test case check behavior when prio cargo expired.
        #This test case cover: 
        #    COMBINE 6

        #arrange
        cart = Cart(4, 50, 0)
        cart.onmove = self.cart_on_move_log

        cart_ctl = CartCtl(cart, Jarvis)
    
        #act
        Jarvis.run()
        
        #assert
        self.assertTrue(cart.empty())


    
if __name__ == '__main__':
    unittest.main()
