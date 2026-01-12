/**
 * Simple test script for NarratorAI flows
 * 
 * This script tests the basic functionality of the AI flows without needing
 * to run the full web application. Useful for development and debugging.
 * 
 * Usage:
 *   npm run test:flows
 * 
 * Requirements:
 *   - GOOGLE_API_KEY must be set in .env.local
 */

import { convertPdfToMarkdown } from '../src/ai/flows/convert-pdf-to-markdown';
import { enhanceMarkdownNarrative } from '../src/ai/flows/enhance-markdown-narrative';
import { convertTextToSpeech } from '../src/ai/flows/convert-text-to-speech';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testPdfConversion() {
  console.log('\n📄 Testing PDF to Markdown conversion...');
  
  try {
    const testPdfPath = path.join(__dirname, 'data', '05-versions-space.pdf');
    
    if (!fs.existsSync(testPdfPath)) {
      console.warn(`⚠️  Test PDF not found at: ${testPdfPath}`);
      return null;
    }
    
    const pdfBuffer = fs.readFileSync(testPdfPath);
    const pdfContent = pdfBuffer.toString('base64');
    
    const result = await convertPdfToMarkdown({ pdfContent });
    
    console.log('✅ PDF conversion successful!');
    console.log(`   Content length: ${result.markdownContent.length} characters`);
    console.log(`   Preview: ${result.markdownContent.substring(0, 100)}...`);
    
    return result.markdownContent;
  } catch (error) {
    console.error('❌ PDF conversion failed:', error);
    return null;
  }
}

async function testEnhancement(markdown: string) {
  console.log('\n✨ Testing AI content enhancement...');
  
  try {
    // Use a short sample for testing
    const sample = markdown.substring(0, 500);
    const result = await enhanceMarkdownNarrative({ markdownContent: sample });
    
    console.log('✅ Enhancement successful!');
    console.log(`   Original length: ${sample.length} characters`);
    console.log(`   Enhanced length: ${result.enhancedContent.length} characters`);
    console.log(`   Preview: ${result.enhancedContent.substring(0, 100)}...`);
    
    return result.enhancedContent;
  } catch (error) {
    console.error('❌ Enhancement failed:', error);
    return null;
  }
}

async function testTextToSpeech(text: string) {
  console.log('\n🎤 Testing text-to-speech conversion...');
  
  try {
    // Use a very short sample for testing (TTS is slower)
    const sample = text.substring(0, 200);
    const result = await convertTextToSpeech({ text: sample });
    
    console.log('✅ Text-to-speech successful!');
    console.log(`   Audio data URI length: ${result.audioDataUri.length} characters`);
    
    // Optionally save the audio file
    const audioData = result.audioDataUri.split(',')[1];
    const audioBuffer = Buffer.from(audioData, 'base64');
    const outputPath = path.join(__dirname, 'output', 'test-audio.wav');
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, audioBuffer);
    console.log(`   Audio saved to: ${outputPath}`);
    
    return result.audioDataUri;
  } catch (error) {
    console.error('❌ Text-to-speech failed:', error);
    return null;
  }
}

async function runTests() {
  console.log('🚀 NarratorAI Flow Tests\n');
  console.log('='.repeat(50));
  
  // Check for API key
  if (!process.env.GOOGLE_API_KEY) {
    console.error('❌ Error: GOOGLE_API_KEY not found in environment variables.');
    console.error('   Please create a .env.local file with your API key.');
    process.exit(1);
  }
  
  console.log('✅ API key found');
  
  // Run tests sequentially
  const markdown = await testPdfConversion();
  
  if (markdown) {
    const enhanced = await testEnhancement(markdown);
    
    if (enhanced) {
      await testTextToSpeech(enhanced);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ All tests completed!\n');
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
