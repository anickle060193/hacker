import React from "react";
import Hls from "hls.js";

const URLS = [
  // Wichita
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2089-2-US-54atMaize.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2097-2-US-54atTyler.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2107-2-US-54atMid-ContinentW.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2108-2-US-54atMid-ContinentE.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2116-2-US-54atDugan.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2118-2-US-54atHoover.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2123-2-US-54atI-235.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2129-2-US-54atWestSt.stream/chunklist.m3u8",

  // Kansas City
  "https://5fca316e7c40f.streamlock.net/live-secure/K435EBC-06-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K010EBIPC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBIPC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBC-06-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBC-12-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBC-13-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBC-14-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBC-05-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBC-07-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBC-08-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBC-09-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBC-10-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBIPC-11-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBC-15-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069NBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435EBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435EBC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435EBC-08-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435EBIPC-10-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435EBIPC-11-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435WBC-07-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435WBC-09-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-05-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-07-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-08-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-11-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBC-06-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBC-09-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBC-10-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBC-12-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-05-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-06-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M009SBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-08-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBIPC-12-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBIPC-13-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-15-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-16-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBIPC-19-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBIPC-20-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBIPC-21-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M169NBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M009SBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M169SBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-07-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBC-09-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBC-10-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBIPC-11-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBIPC-14-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBC-13-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBIPC-22-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049NBIPC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M071SBIPC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470WBIPC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435EBIPC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBIPC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435WBIPC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435WBIPC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M670EBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M670WBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-23-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-24-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-25-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-26-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-27-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBC-17-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049NBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBC-05-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M071SBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-28-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-29-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-30-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBC-31-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBC-32-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBC-33-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049NBC-07-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435EBC-06-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBC-16-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M071SBC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470WBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470WBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470WBC-05-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470WBC-06-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470SBC-07-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470SBC-08-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049SBC-08-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049NBC-09-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470EBC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBC-01C-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBC-01B-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069SBC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069SBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069NBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635NBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635SBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635SBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635SBC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635NBC-05-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635NBC-06-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635SBC-07-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635SBC-08-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635NBC-09-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070WBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-13-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435WBC-06A-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBC-07-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBC-08-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBC-10-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBC-11-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBC-12-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBC-13-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBC-09-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435EBC-05A-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435WBC-05-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635SBC-10-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635SBC-11-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635NBC-12-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635SBC-13-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635NBC-14-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K635SBC-15-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K007SBC-30-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070WBIPC-91-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070WBC-101-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070WBIPC-71-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBC-21-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBC-11-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBIPC-51-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBIPC-61-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBC-31-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435NBC-41-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBC-26-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069NBIPC-01B-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029SBC-05-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBC-06-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBC-07-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029SBC-23-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBC-14-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-15-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBC-16-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBC-18-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBIPC-21-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBIPC-25-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBIPC-24-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBIPC-23-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBIPC-22-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBIPC-21-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBIPC-20-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBIPC-19-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBIPC-18-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBIPC-17-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBIPC-16-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBIPC-14-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBIPC-15-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-22-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBC-22-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-08A-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M050EBIPC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470SBIPC-09-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029SBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K010EBC-13-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K010EBIPC-11-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K010EBIPC-10-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K007NBIPC-10-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K007SBC-20-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M050EBIPC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M050EBIPC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069SBC-10-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069NBIPC-11-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069SBC-12-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069SBC-13-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049NBIPC-50-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049SBIPC-46-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049NBIPC-44-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049NBIPC-40-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049NBIPC-36-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049SBIPC-34-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049NBIPC-32-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M071NBIPC-28-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBC-04T-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBC-05T-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470NBIPC-10-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBIPC-17-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBIPC-20-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M670EBIPC-01A-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M291SBIPC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070WBIPC-35-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M050WBIPC-05-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M050WBIPC-06-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M635SBIPC-05-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M635SBIPC-07-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029SBIPC-13-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBIPC-17-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029SBIPC-18-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435WBIPC-60-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435SBIPC-55-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBIPC-54-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M670WBIPC-01B-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBIPC-34-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029SBIPC-40-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBIPC-19-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBIPC-15-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBIPC-14-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435EBIPC-65-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049SBIPC-42-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBIPC-55-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049SBIPC-30-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M071NBIPC-20-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M071SBIPC-22-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBIPC-89-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBIPC-88-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBIPC-87-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBIPC-86-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBIPC-85-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBIPC-83-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBIPC-82-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBIPC-81-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBIPC-80-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBIPC-79-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035NBIPC-78-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBIPC-77-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBIPC-10-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBIPC-11-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBIPC-12-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBIPC-13-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBIPC-14-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBIPC-08-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBIPC-15-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBIPC-16-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070WBIPC-17-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBIPC-18-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029SBC-21-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070EBIPC-121-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBIPC-50-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBIPC-52-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435NBIPC-54-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBIPC-56-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435NBIPC-58-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBIPC-74-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBIPC-76-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBIPC-80-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435NBIPC-82-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K007NBIPC-21-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K007NBIPC-08-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K010EBIPC-06-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K010EBIPC-04-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBIPC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M071NBIPC-21-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBIPC-05A-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435EBIPC-38-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435WBIPC-39-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435NBIPC-42-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435WBIPC-41-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBIPC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435WBIPC-40-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069SBIPC-58-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069SBIPC-60-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069NBIPC-64-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069SBIPC-66-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069SBIPC-68-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K069NBIPC-02A-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M049SBIPC-42-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470NBC-19A-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470NBC-12A-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M470SBC-23A-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K035SBC-13-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435EBC-17-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435EBC-34-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K435SBC-05-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K010EBC-14-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K007SBIPC-07-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K007SBC-02-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K007SBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBIPC-46R-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070WBC-16C-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M050EBIPC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435EBIPC-63-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M169NBC-25-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M169SBC-20-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBC-57-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBC-58-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435NBC-56-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M435EBC-61-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBC-16-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-56-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029SBC-46-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBC-54-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029NBC-49-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029SBC-48-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M029SBC-22-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-18A-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M070EBC-18B-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M635SBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035NBC-59-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBC-62-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M035SBC-63-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K070WBC-01-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/M291NBC-03-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K010WBIPC-15-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K010WBIPC-16-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K010EBIPC-17-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K010EBIPC-18-LQ.stream/playlist.m3u8",
  "https://5fca316e7c40f.streamlock.net/live-secure/K169NBC-01-LQ.stream/playlist.m3u8",
];

const CamerasInner: React.FC = () => {
  const [url] = React.useState(
    () => URLS[Math.floor(Math.random() * URLS.length)]
  );
  const [video, setVideo] = React.useState<HTMLVideoElement | null>(null);
  const [paused, setPaused] = React.useState(true);
  const [load, setLoad] = React.useState(false);

  React.useEffect(() => {
    if (!video || !load) {
      return;
    }

    const vid = video;

    function onPausedChanged() {
      setPaused(vid.paused);
    }

    video.addEventListener("play", onPausedChanged);
    video.addEventListener("pause", onPausedChanged);

    onPausedChanged();

    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(vid);

    return () => {
      video.removeEventListener("play", onPausedChanged);
      video.removeEventListener("pause", onPausedChanged);

      hls.destroy();
    };
  }, [video, load, url]);

  return (
    <div
      css={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {load && (
        <video
          ref={setVideo}
          css={{
            width: "100%",
            height: "100%",
            filter: "grayscale( 100% ) brightness( 50% )",
          }}
          autoPlay={true}
          controls={false}
        />
      )}
      <div
        css={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `hsl( from var( --primary-color ) h s l / 0.2 )`,
          cursor: "pointer",
        }}
        onClick={async () => {
          if (!load) {
            setLoad(true);
          } else if (video) {
            if (video.paused) {
              await video.play();
            } else {
              video.pause();
            }
          }
        }}
      />
      <svg
        css={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate( -50%, -50% )",
          width: "4rem",
          height: "4rem",
          fill: "var( --primary-color )",
          pointerEvents: "none",
          transition: "opacity 200ms ease-in-out",
        }}
        style={{
          opacity: paused ? 1 : 0,
        }}
        viewBox="0 0 10 10"
      >
        <path d="M2,2 L7,5 L2,8 z" />
      </svg>
    </div>
  );
};

export default CamerasInner;
