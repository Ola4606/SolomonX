"use strict";
//these are the usdt markets tradeable on binance
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketPairs = void 0;
const marketPairs = [
    "BTC/USDT",
    "ETH/USDT",
    "SHIB/USDT",
    "BUSD/USDT",
    "DOGE/USDT",
    "BNB/USDT",
    "XRP/USDT",
    "AVAX/USDT",
    "SOL/USDT",
    "LRC/USDT",
    "TRX/USDT",
    "DOT/USDT",
    "FTM/USDT",
    "ADA/USDT",
    "OMG/USDT",
    "SAND/USDT",
    "LTC/USDT",
    "ICP/USDT",
    "VET/USDT",
    "MANA/USDT",
    "FIL/USDT",
    "LINK/USDT",
    "AXS/USDT",
    "USDC/USDT",
    "MATIC/USDT",
    "UMA/USDT",
    "LUNA/USDT",
    "POND/USDT",
    "SLP/USDT",
    "BAT/USDT",
    "DYDX/USDT",
    "ALICE/USDT",
    "CHZ/USDT",
    "ALGO/USDT",
    "BTCST/USDT",
    "ONE/USDT",
    "FTT/USDT",
    "ATOM/USDT",
    "NKN/USDT",
    "EOS/USDT",
    "ETC/USDT",
    "CRV/USDT",
    "ENJ/USDT",
    "CHR/USDT",
    "GRT/USDT",
    "SUPER/USDT",
    "THETA/USDT",
    "HOT/USDT",
    "BCH/USDT",
    "CAKE/USDT",
    "NEAR/USDT",
    "HBAR/USDT",
    "TLM/USDT",
    "JST/USDT",
    "LINA/USDT",
    "SUN/USDT",
    "WIN/USDT",
    "HNT/USDT",
    "BTT/USDT",
    "WAXP/USDT",
    "XLM/USDT",
    "UNI/USDT",
    "KSM/USDT",
    "DENT/USDT",
    "IDEX/USDT",
    "MOVR/USDT",
    "SXP/USDT",
    "EUR/USDT",
    "NEO/USDT",
    "FLM/USDT",
    "OXT/USDT",
    "DAR/USDT",
    "RUNE/USDT",
    "IOTX/USDT",
    "STX/USDT",
    "AR/USDT",
    "C98/USDT",
    "ROSE/USDT",
    "AAVE/USDT",
    "EGLD/USDT",
    "SUSHI/USDT",
    "DASH/USDT",
    "XTZ/USDT",
    "CELR/USDT",
    "SRM/USDT",
    "QTUM/USDT",
    "XEM/USDT",
    "XEC/USDT",
    "AUD/USDT",
    "FET/USDT",
    "COTI/USDT",
    "TFUEL/USDT",
    "MKR/USDT",
    "ZEN/USDT",
    "BADGER/USDT",
    "XMR/USDT",
    "ZEC/USDT",
    "1INCH/USDT",
    "MINA/USDT",
    "SC/USDT",
    "ONT/USDT",
    "CKB/USDT",
    "IOTA/USDT",
    "ANKR/USDT",
    "ARPA/USDT",
    "ERN/USDT",
    "LPT/USDT",
    "ZIL/USDT",
    "REEF/USDT",
    "RVN/USDT",
    "COMP/USDT",
    "DODO/USDT",
    "YFII/USDT",
    "FLOW/USDT",
    "OCEAN/USDT",
    "GALA/USDT",
    "IOST/USDT",
    "YFI/USDT",
    "SKL/USDT",
    "BAKE/USDT",
    "AUDIO/USDT",
    "DUSK/USDT",
    "CELO/USDT",
    "MASK/USDT",
    "EPS/USDT",
    "WRX/USDT",
    "SNX/USDT",
    "ATA/USDT",
    "KAVA/USDT",
    "LIT/USDT",
    "KEEP/USDT",
    "RSR/USDT",
    "RAY/USDT",
    "OGN/USDT",
    "BOND/USDT",
    "FUN/USDT",
    "INJ/USDT",
    "GBP/USDT",
    "DATA/USDT",
    "QNT/USDT",
    "ICX/USDT",
    "STORJ/USDT",
    "KLAY/USDT",
    "BTCUP/USDT",
    "IRIS/USDT",
    "GNO/USDT",
    "TWT/USDT",
    "ORN/USDT",
    "WAVES/USDT",
    "MBOX/USDT",
    "LTO/USDT",
    "ZRX/USDT",
    "ALPHA/USDT",
    "BNX/USDT",
    "PERL/USDT",
    "REN/USDT",
    "RLC/USDT",
    "DGB/USDT",
    "BZRX/USDT",
    "KEY/USDT",
    "PSG/USDT",
    "HARD/USDT",
    "XVS/USDT",
    "KNC/USDT",
    "BAL/USDT",
    "CLV/USDT",
    "VTHO/USDT",
    "BEL/USDT",
    "CVC/USDT",
    "LAZIO/USDT",
    "TVK/USDT",
    "UNFI/USDT",
    "BETA/USDT",
    "CFX/USDT",
    "ADX/USDT",
    "TRB/USDT",
    "YGG/USDT",
    "MIR/USDT",
    "TUSD/USDT",
    "MDX/USDT",
    "CTSI/USDT",
    "PERP/USDT",
    "FOR/USDT",
    "ILV/USDT",
    "XRPUP/USDT",
    "NANO/USDT",
    "SFP/USDT",
    "TROY/USDT",
    "TOMO/USDT",
    "FRONT/USDT",
    "ETHUP/USDT",
    "AKRO/USDT",
    "DEGO/USDT",
    "BTCDOWN/USDT",
    "BAND/USDT",
    "FORTH/USDT",
    "BLZ/USDT",
    "DF/USDT",
    "TKO/USDT",
    "SYS/USDT",
    "LSK/USDT",
    "AGLD/USDT",
    "NU/USDT",
    "BTS/USDT",
    "DOTUP/USDT",
    "FIDA/USDT",
    "VIDT/USDT",
    "XVG/USDT",
    "POLS/USDT",
    "BNT/USDT",
    "TRU/USDT",
    "STMX/USDT",
    "TRIBE/USDT",
    "GTC/USDT",
    "CHESS/USDT",
    "UTK/USDT",
    "AUTO/USDT",
    "AUCTION/USDT",
    "BNBUP/USDT",
    "RGT/USDT",
    "FIS/USDT",
    "FIO/USDT",
    "BTG/USDT",
    "PUNDIX/USDT",
    "VITE/USDT",
    "XRPDOWN/USDT",
    "ETHDOWN/USDT",
    "LTCUP/USDT",
    "CTK/USDT",
    "BURGER/USDT",
    "COS/USDT",
    "DNT/USDT",
    "RAMP/USDT",
    "PNT/USDT",
    "MFT/USDT",
    "MTL/USDT",
    "RARE/USDT",
    "NBS/USDT",
    "PAXG/USDT",
    "ALPACA/USDT",
    "DIA/USDT",
    "LINKUP/USDT",
    "ADAUP/USDT",
    "NULS/USDT",
    "MDT/USDT",
    "POLY/USDT",
    "GTO/USDT",
    "WAN/USDT",
    "WTC/USDT",
    "TCT/USDT",
    "PHA/USDT",
    "ANT/USDT",
    "AVA/USDT",
    "DOCK/USDT",
    "BAR/USDT",
    "DREP/USDT",
    "ATM/USDT",
    "WING/USDT",
    "AION/USDT",
    "HIVE/USDT",
    "WNXM/USDT",
    "COCOS/USDT",
    "FIRO/USDT",
    "BEAM/USDT",
    "FARM/USDT",
    "SUSHIUP/USDT",
    "OM/USDT",
    "QUICK/USDT",
    "GHST/USDT",
    "MITH/USDT",
    "REQ/USDT",
    "CVP/USDT",
    "OG/USDT",
    "RIF/USDT",
    "TORN/USDT",
    "AAVEUP/USDT",
    "BNBDOWN/USDT",
    "EOSUP/USDT",
    "ELF/USDT",
    "STPT/USDT",
    "ARDR/USDT",
    "FILUP/USDT",
    "STRAX/USDT",
    "1INCHUP/USDT",
    "DEXE/USDT",
    "ACM/USDT",
    "SXPUP/USDT",
    "REP/USDT",
    "XTZUP/USDT",
    "LINKDOWN/USDT",
    "CTXC/USDT",
    "MBL/USDT",
    "DCR/USDT",
    "JUV/USDT",
    "NMR/USDT",
    "KMD/USDT",
    "MLN/USDT",
    "DOTDOWN/USDT",
    "UNIUP/USDT",
    "USDP/USDT",
    "RAD/USDT",
    "LTCDOWN/USDT",
    "ONG/USDT",
    "TRXUP/USDT",
    "1INCHDOWN/USDT",
    "SXPDOWN/USDT",
    "EOSDOWN/USDT",
    "ADADOWN/USDT",
    "ASR/USDT",
    "XLMUP/USDT",
    "GXS/USDT",
    "YFIUP/USDT",
    "YFIDOWN/USDT",
    "SUSHIDOWN/USDT",
    "UNIDOWN/USDT",
    "AAVEDOWN/USDT",
    "BCHUP/USDT",
    "FILDOWN/USDT",
    "XTZDOWN/USDT",
    "TRXDOWN/USDT",
    "BCHDOWN/USDT",
    "XLMDOWN/USDT",
    "SUSD/USDT",
    "NPXS/USDT",
];
exports.marketPairs = marketPairs;