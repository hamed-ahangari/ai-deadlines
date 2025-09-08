import { Conference } from '@/types/conference';

// Import all conference YAML files
import aaaiData from '@/data/conferences/aaai.yml';
import aamasData from '@/data/conferences/aamas.yml';
import aclData from '@/data/conferences/acl.yml';
import acmMmData from '@/data/conferences/acm_mm.yml';
import aistatsData from '@/data/conferences/aistats.yml';
import altData from '@/data/conferences/alt.yml';
import cecData from '@/data/conferences/cec.yml';
import chiData from '@/data/conferences/chi.yml';
import cikmData from '@/data/conferences/cikm.yml';
import colingData from '@/data/conferences/coling.yml';
import collasData from '@/data/conferences/collas.yml';
import colmData from '@/data/conferences/colm.yml';
import coltData from '@/data/conferences/colt.yml';
import conllData from '@/data/conferences/conll.yml';
import corlData from '@/data/conferences/corl.yml';
import cpalData from '@/data/conferences/cpal.yml';
import cvprData from '@/data/conferences/cvpr.yml';
import ecaiData from '@/data/conferences/ecai.yml';
import eccvData from '@/data/conferences/eccv.yml';
import ecirData from '@/data/conferences/ecir.yml';
import ecmlPkddData from '@/data/conferences/ecml_pkdd.yml';
import emnlpData from '@/data/conferences/emnlp.yml';
import emnlpIndustryData from '@/data/conferences/emnlp_industry_track.yml';
import emnlpSystemData from '@/data/conferences/emnlp_system_demonstrations_track.yml';
import esannData from '@/data/conferences/esann.yml';
import eurographicsData from '@/data/conferences/eurographics.yml';
import fgData from '@/data/conferences/fg.yml';
import icannData from '@/data/conferences/icann.yml';
import icasspData from '@/data/conferences/icassp.yml';
import iccvData from '@/data/conferences/iccv.yml';
import icdarData from '@/data/conferences/icdar.yml';
import icdmData from '@/data/conferences/icdm.yml';
import iclrData from '@/data/conferences/iclr.yml';
import icmlData from '@/data/conferences/icml.yml';
import icompData from '@/data/conferences/icomp.yml';
import icraData from '@/data/conferences/icra.yml';
import ijcaiData from '@/data/conferences/ijcai.yml';
import ijcnlpAaclData from '@/data/conferences/ijcnlp_and_aacl.yml';
import ijcnnData from '@/data/conferences/ijcnn.yml';
import interspeechData from '@/data/conferences/interspeech.yml';
import irosData from '@/data/conferences/iros.yml';
import iuiData from '@/data/conferences/iui.yml';
import kddData from '@/data/conferences/kdd.yml';
import ksemData from '@/data/conferences/ksem.yml';
import lrecData from '@/data/conferences/lrec.yml';
import mathaiData from '@/data/conferences/mathai.yml';
import naaclData from '@/data/conferences/naacl.yml';
import neuripsData from '@/data/conferences/neurips.yml';
import rlcData from '@/data/conferences/rlc.yml';
import rssData from '@/data/conferences/rss.yml';
import sgpData from '@/data/conferences/sgp.yml';
import siggraphData from '@/data/conferences/siggraph.yml';
import uaiData from '@/data/conferences/uai.yml';
import wacvData from '@/data/conferences/wacv.yml';
import wsdmData from '@/data/conferences/wsdm.yml';
import wwwData from '@/data/conferences/www.yml';

// Combine all conference data into a single array
const allConferencesData: Conference[] = [
  ...aaaiData,
  ...aamasData,
  ...aclData,
  ...acmMmData,
  ...aistatsData,
  ...altData,
  ...cecData,
  ...chiData,
  ...cikmData,
  ...colingData,
  ...collasData,
  ...colmData,
  ...coltData,
  ...conllData,
  ...corlData,
  ...cpalData,
  ...cvprData,
  ...ecaiData,
  ...eccvData,
  ...ecirData,
  ...ecmlPkddData,
  ...emnlpData,
  ...emnlpIndustryData,
  ...emnlpSystemData,
  ...esannData,
  ...eurographicsData,
  ...fgData,
  ...icannData,
  ...icasspData,
  ...iccvData,
  ...icdarData,
  ...icdmData,
  ...iclrData,
  ...icmlData,
  ...icompData,
  ...icraData,
  ...ijcaiData,
  ...ijcnlpAaclData,
  ...ijcnnData,
  ...interspeechData,
  ...irosData,
  ...iuiData,
  ...kddData,
  ...ksemData,
  ...lrecData,
  ...mathaiData,
  ...naaclData,
  ...neuripsData,
  ...rlcData,
  ...rssData,
  ...sgpData,
  ...siggraphData,
  ...uaiData,
  ...wacvData,
  ...wsdmData,
  ...wwwData,
];

export default allConferencesData;
