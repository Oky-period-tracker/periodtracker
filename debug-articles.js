// Debug script to check why articles don't appear in mobile app
// Run with: node debug-articles.js

const axios = require('axios');

const CMS_URL = process.env.CMS_URL || 'http://localhost:5000';
const LANG = process.env.LANG || 'en';

async function debugArticles() {
  console.log('🔍 Debugging Article Visibility Issue\n');
  console.log(`CMS URL: ${CMS_URL}`);
  console.log(`Language: ${LANG}\n`);

  try {
    // Test 1: Check if CMS is running
    console.log('📡 Test 1: Checking if CMS is accessible...');
    try {
      await axios.get(CMS_URL);
      console.log('✅ CMS is running\n');
    } catch (error) {
      console.log('❌ CMS is not accessible');
      console.log('   Make sure CMS is running: cd packages/cms && yarn serve\n');
      return;
    }

    // Test 2: Fetch articles from mobile API
    console.log('📡 Test 2: Fetching articles from mobile API...');
    const mobileUrl = `${CMS_URL}/mobile/articles/${LANG}`;
    console.log(`   URL: ${mobileUrl}`);
    
    try {
      const response = await axios.get(mobileUrl);
      const articles = response.data;
      
      console.log(`✅ API responded with ${articles.length} articles\n`);
      
      if (articles.length === 0) {
        console.log('⚠️  No articles found!');
        console.log('   Possible reasons:');
        console.log('   1. No articles marked as "Live"');
        console.log('   2. No articles in the selected language');
        console.log('   3. Province filtering is blocking articles');
        console.log('   4. Database migration not run\n');
      } else {
        console.log('📄 Found articles:');
        articles.slice(0, 5).forEach((article, index) => {
          console.log(`   ${index + 1}. "${article.article_heading}" (${article.category_title} > ${article.subcategory_title})`);
        });
        if (articles.length > 5) {
          console.log(`   ... and ${articles.length - 5} more`);
        }
        console.log();
      }
    } catch (error) {
      console.log('❌ Failed to fetch articles');
      console.log(`   Error: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      console.log();
    }

    // Test 3: Check if there are categories and subcategories
    console.log('📡 Test 3: Checking database structure...');
    console.log('   This would require database access');
    console.log('   Run this SQL query manually:');
    console.log('   ');
    console.log('   SELECT COUNT(*) as article_count, live, lang');
    console.log('   FROM periodtracker.article');
    console.log('   GROUP BY live, lang;');
    console.log();

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

// Instructions
console.log('='.repeat(60));
console.log('Article Visibility Debugger');
console.log('='.repeat(60));
console.log();

debugArticles().then(() => {
  console.log('='.repeat(60));
  console.log('🔧 Quick Fixes:');
  console.log('='.repeat(60));
  console.log();
  console.log('1. Rebuild CMS:');
  console.log('   cd /Users/kilataban/Development/Oky/test/periodtracker');
  console.log('   yarn workspace @oky/oky-cms build');
  console.log('   cd packages/cms && yarn serve');
  console.log();
  console.log('2. Check article is Live in CMS:');
  console.log('   - Go to http://localhost:5000');
  console.log('   - Login');
  console.log('   - Go to Encyclopedia');
  console.log('   - Toggle "Live" switch ON for your articles');
  console.log();
  console.log('3. Run database migration (if province columns missing):');
  console.log('   psql -U periodtracker -d periodtracker -f sql/1740221234567-province-content-restriction.sql');
  console.log();
  console.log('4. Check categories and subcategories exist:');
  console.log('   - Make sure you created at least one category');
  console.log('   - Make sure you created at least one subcategory');
  console.log('   - Assign articles to valid category/subcategory');
  console.log();
});
