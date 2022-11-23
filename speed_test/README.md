# Speed test results

With switchcases that have 8 clauses, repeated 10^7 times per test.

| Without the transformer | With the transformer | Winner |
| :- | :- | -: |
| 0.5013423 s | 0.4695772 s | with |
| 0.4608118 s | 0.5447016 s | without |
| 0.4538083 s | 0.4186085 s | with |
| 0.4700488 s | 0.4543332 s | with |
| 0.4649994 s | 0.5109048 s | without |
| 0.5083704 s | 0.4573691 s | with |
| 0.4666383 s | 0.5028893 s | without |
| 0.5342452 s | 0.6151212 s | without |

## Conclusion
The difference is unnoticable (at most 10ns) and the winner is random.
