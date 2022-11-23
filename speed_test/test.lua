local frequency = 10^7
local cases = 8


local function generateWithout()
	local clauses = ''

	for i = 1, cases-1 do
		clauses = clauses
			.. ([[ if a == %i then
                print("%s")
                break
            end ]]):format(i, i)
	end

	clauses = clauses
		.. [[
        print("uh what?")
        break
        ]]

	return ([[
		function print(a) end
        local a = 2
        repeat
            %s
        until true
    ]]):format(clauses)
end

local function generateWith()
	local clauses = ''

	for i = 1, cases-1 do
		clauses = clauses
			.. ([[if a == %i then
                print("%s")
                --break
            else]]):format(i, i)
	end

	clauses = clauses
		.. [[
            print("uh what?")
            --break
        end
        ]]

	return ([[
		function print(a) end
        local a = 2
        --switch
        %s
    ]]):format(clauses)
end

local withoutFunc, msg = loadstring(generateWithout())
local start = os.clock()
for i = 1, frequency do
	withoutFunc()
end
print(("Without the transformer:    %.8g"):format(os.clock() - start))


local withFunc, msg = loadstring(generateWith())
start = os.clock()
for i = 1, frequency do
	withFunc()
end
print(("With the transformer:       %.8g"):format(os.clock() - start))
