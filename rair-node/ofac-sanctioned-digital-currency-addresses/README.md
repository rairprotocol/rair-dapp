# OFAC Sanctioned Digital Currency Addresses

Tool to extract the 'sanctioned' Bitcoin (and other Digital Currency assets)
addresses from the [Specially Designated Nationals (SDN) list][1] of the US
Office of Foreign Asset Control. An XML version of this list can be downloaded
here: [`sdn_advanced.xml`][2].

[1]: https://home.treasury.gov/policy-issues/financial-sanctions/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists
[2]: https://www.treasury.gov/ofac/downloads/sanctions/1.0/sdn_advanced.xml

As of December 2023 the tool covers the following assets. There might be assets
on the SDN list that aren't covered yet. These can be found by grepping for
"Digital Currency Address" on the `sdn_advanced.xml` file. Feel free to submit
an issue or pull-request adding assets.

- XBT (Bitcoin)
- ETH (Ethereum)
- XMR (Monero)
- LTC (Litecoin)
- ZEC (ZCash)
- DASH (Dash)
- BTG (Bitcoin Gold)
- ETC (Ethereum Classic)
- BSV (Bitcoin Satoshi Vision)
- BCH (Bitcoin Cash)
- XVG (Verge)
- USDC (USD Coin)
- USDT (USD Tether)
- XRP (Ripple)
- TRX (Tron)
- ARB (Arbitrum)
- BSC (Binance Smart Chain)

The sanctioned addresses can be extracted with this tool from the
[`sdn_advanced.xml`][2] file. The tools supports the following output formats:
- `TXT` file format (one address per line)
- `JSON` file containing a list of addresses

## Automatically Updated Lists

The [`lists`](/tree/lists) branch of this repository contains automatically
updated lists of sanctioned addresses for each covered asset. These are
generated each night at 0 UTC by a GitHub Actions workflow.

## Usage Examples

The SDN list as XML file (~80 MB in May 2023) can be downloaded, for example,
via `wget`:

``` console
$ wget https://www.treasury.gov/ofac/downloads/sanctions/1.0/sdn_advanced.xml
```

By default, the python script expects the [`sdn_advanced.xml`][2] XML file to be
located in the current working directory. This can be changed with the
`-sdn /path/to/sdn_advanced.xml` argument.

---

By default, the `XBT` (Bitcoin) addresses are extracted into a `TXT` file:

``` console
$ python3 generate-address-list.py
$ cat sanctioned_addresses_XBT.txt | head -n2
12QtD5BFwRsdNsAZY76UVE1xyCGNTojH9h
1Kuf2Rd8mDyAViwBozGTNYnvWL8uYFrkVo
```

Other assets an be selected by supplying the tickers:

``` console
$ python3 generate-address-list.py ETH ETC DASH LTC
$ ls sanctioned_addresses_* -1
sanctioned_addresses_DASH.txt
sanctioned_addresses_ETC.txt
sanctioned_addresses_ETH.txt
sanctioned_addresses_LTC.txt
```

---

By default, a `TXT` file listing an address per line is produced. For example,
a JSON file listing the addresses can be produced with the `-f JSON` flag.

``` console
$ python3 generate-address-list.py XMR -f JSON
$ ls sanctioned_addresses_* -1
sanctioned_addresses_XMR.json
```

---

For detailed help and usage instructions please see `python3 generate-address-list.py --help`

## License and Warranty

This software is provided under the MIT License. For details see [LICENSE](LICENSE).

The author does not provide warranty of any kind. Especially not on the
completeness and correctness of the produced lists.
