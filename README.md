# rbxts-transformer-switchcase

Does some funny switchcase stuff, to make it faster(?) and to make it easier to read.

## Example
<details>
<summary>Input typescript</summary>

```ts
let a = 2

switch (a) {
    case 1:
        print("one");
        break;

    case 2:
        print("two");
        break;

    default:
        print("uhh what??");
        break;
}
```
</details>

<details>
<summary>Output luau without the transformer</summary>

```lua
local a = 2
repeat
	if a == 1 then
		print("one")
		break
	end
	if a == 2 then
		print("two")
		break
	end
	print("uhh what??")
	break
until true
```
</details>

<details>
<summary>Output luau with the transformer</summary>

```lua
local a = 2
-- switch
if a == 1 then
    print("one")
elseif a == 2 then
    print("two")
else
    print("uhh what??")
end
```
</details>
