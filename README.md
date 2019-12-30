# ReactCalculator


Simple calculator app created with nodeJS backend and React/ES6 frontend.

![alt text](https://github.com/Skeletor48/ReactCalculator/blob/master/misc/Screenshot%202019-12-30%20at%2017.46.57.png)

I choosed two handle them completely separated so both the client and the server has its own package.json with their own starting scripts.

The Server has two public endpoints `/writeMemory` and `/readMemory`. The endpoints are manipulating a json file.

The client is a traditional calculator app with all the functionality.

The display has two parts. The upper zone is the `total` display where the result appears after the equation. The bottom of the Display is the computational screen where user can check (and fix) the inputs. The computational screen reflects the equation string that will be evaluated by the calculator logic. 

The calculator has a `CA` button to clear every input from the screen and from the component state also.
The `←` is for minor fixes, it deletes the last input one by one on each press.
The `M+` button is the memory write button it shoots a post request via axios. The saved number will be the one that is on the total display at the moment of the button press. Also `M+` can reset the memory, if the number we want to save is 0 (0 is the default value in the memory file, hence set value to 0 is equal to a reseted state)
The `M-` button is the read memory buttomn. If the store has a value not equal to 0, it means wwee have a stored number, so app will indicatet this via changing the colour and size of `M-` button. Pressing the memory read wil set the stored value to the computational screen, so we can immediately use it for a new equation.

Pressing the digits and the operators set the button values to the computation screen, pressing `=` will then evaluate the whole input string together.
Again, when a number or a result of an equation transfer to the total display, we can save it to the memory from there.

So reseting memory is like  `0` + `=` + `M+` . 