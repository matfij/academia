namespace Events;

/*
* Events enable to decouple publisher from subscribers
* simple addition of new subscribers 
* can broadcast message to all objects
* objects can cancel listening
* 
* Observer design patter - allows objects to notify other object of some event
* 
* Delegate - type representing method with a particular shape
* 
* Event - special type of multicast delegate that enables to notify other classes
* when something happens. Can only be raised from the class it belongs to (contrary to delegate).
* 
* Memory leak - happens if some object could be removed by garbage collector as it is no longer used
* but due to some reference it can not happen (e.g. not unsubscribing to events at the end of scope).
*/
