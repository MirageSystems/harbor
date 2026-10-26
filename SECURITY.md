# Security policy

## Scope

Harbor is a testnet MVP. The only deployment is on Polygon Amoy:

- `LetterOfCredit` at `0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35`

The contract has no owner and cannot be upgraded or paused. A bug in the deployed contract cannot be patched in place. The fix is a new deployment.

The contract has not had an external audit.

## Reporting a vulnerability

Report it privately through GitHub: open the **Security** tab of this repository and choose **Report a vulnerability**. Please don't open a public issue.

Include the affected file or address, the steps to reproduce, and the impact you expect. A Foundry test that demonstrates the issue is the most useful thing you can send.

We aim to reply within 5 working days.
