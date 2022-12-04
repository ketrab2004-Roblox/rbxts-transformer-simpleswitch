# rbxts-transformer-switchcase
![npm version](https://img.shields.io/npm/v/rbxts-transformer-switchcase?label=npm) ![npm license](https://img.shields.io/npm/l/rbxts-transformer-switchcase) [![npm test](https://github.com/ketrab2004-Roblox/rbxts-transformer-simpleswitch/actions/workflows/test.yaml/badge.svg?branch=main&event=push)](https://github.com/ketrab2004-Roblox/rbxts-transformer-simpleswitch/actions/workflows/test.yaml)

Converts switch cases into simple if else blocks, to make it [faster](./speed_test/) and to make it more legible.

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
    -- break
elseif a == 2 then
    print("two")
    -- break
else
    print("uhh what??")
    -- break
end
```
</details>

## How to use
1. Install by running `npm i rbxts-transformer-switchcase --save-dev`
1. Add it as a plugin to your `tsconfig.json`, [see options here](#settings)

    ```json
    {
        "compilerOptions": {
            ...
            "plugins": [
                {
                    "transform": "rbxts-transformer-switchcase",
                    ...
                }
            ]
        }
    }
    ```
1. Try it out

## Settings
In the `tsconfig.json` you can add settings for the plugin.
<details>
<summary>Example</summary>

```json
{
    "compilerOptions": {
        ...
        "plugins": [
            {
                "transform": "rbxts-transformer-switchcase",
                "disableSwitchComments": false,
                "disableBreakComments": true
            }
        ]
    }
}
```
</details>

| Identifier | Type | Default | Description |
| -: | :-: | :-: | - |
| `disableSwitchComments` | boolean | false | whether or not `--switch` should be added in front of if statements generated by the transformer |
| `disableBreakComments` | boolean | false | whether or not removed break statements should get a `--break` in their place |

## Building
### Setup
Install dependencies using `npm i`.

### Build the transformer
Run `npm run build` in the root of the project.

### Build the example
Run `npm run build` in `/example`.

### Run tests
Run `npm run test` for quick and simple tests and `npm run test:fancy` for more readable results.
