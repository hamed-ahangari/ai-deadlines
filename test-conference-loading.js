// Simple test to verify conference loading
import fs from 'fs';
import path from 'path';

// Count YAML files in the conferences directory
const conferencesDir = path.join(process.cwd(), 'src/data/conferences');
const yamlFiles = fs.readdirSync(conferencesDir).filter(file => file.endsWith('.yml'));

console.log(`Found ${yamlFiles.length} YAML files in conferences directory:`);
yamlFiles.forEach(file => console.log(`  - ${file}`));

// Expected conferences (from the directory listing you provided)
const expectedFiles = [
    'aaai.yml', 'aamas.yml', 'acl.yml', 'acm_mm.yml', 'aistats.yml', 'alt.yml',
    'cec.yml', 'chi.yml', 'cikm.yml', 'coling.yml', 'collas.yml', 'colm.yml',
    'colt.yml', 'conll.yml', 'corl.yml', 'cpal.yml', 'cvpr.yml', 'ecai.yml',
    'eccv.yml', 'ecir.yml', 'ecml_pkdd.yml', 'emnlp.yml', 'emnlp_industry_track.yml',
    'emnlp_system_demonstrations_track.yml', 'esann.yml', 'eurographics.yml',
    'fg.yml', 'icann.yml', 'icassp.yml', 'iccv.yml', 'icdar.yml', 'icdm.yml',
    'iclr.yml', 'icml.yml', 'icomp.yml', 'icra.yml', 'ijcai.yml', 'ijcnlp_and_aacl.yml',
    'ijcnn.yml', 'interspeech.yml', 'iros.yml', 'iui.yml', 'kdd.yml', 'ksem.yml',
    'lrec.yml', 'mathai.yml', 'naacl.yml', 'neurips.yml', 'nlbse.yml', 'rlc.yml',
    'rss.yml', 'sgp.yml', 'siggraph.yml', 'uai.yml', 'wacv.yml', 'wsdm.yml', 'www.yml'
];

console.log(`\nExpected ${expectedFiles.length} files, found ${yamlFiles.length} files`);

if (yamlFiles.length === expectedFiles.length) {
    console.log('✅ All expected conference files are present!');
} else {
    console.log('❌ Mismatch in file count');
    const missing = expectedFiles.filter(file => !yamlFiles.includes(file));
    const extra = yamlFiles.filter(file => !expectedFiles.includes(file));
    
    if (missing.length > 0) {
        console.log('Missing files:', missing);
    }
    if (extra.length > 0) {
        console.log('Extra files:', extra);
    }
}






