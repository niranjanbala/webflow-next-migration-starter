'use client';

import { useState, useEffect } from 'react';
import { webflowPageGenerator, WebflowPageTemplate } from '@/lib/webflow-page-generator';
import { webflowClient } from '@/lib/webflow-client';

export default function PageGenerationDemo() {
  const [templates, setTemplates] = useState<WebflowPageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [collections, setCollections] = useState<any[]>([]);
  const [collectionItems, setCollectionItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [generatedPage, setGeneratedPage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Load templates and collections on mount
    const loadData = async () => {
      try {
        const availableTemplates = webflowPageGenerator.getTemplates();
        setTemplates(availableTemplates);
        
        const availableCollections = await webflowClient.getCollections();
        setCollections(availableCollections);
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Load collection items when template changes
    const loadCollectionItems = async () => {
      if (!selectedTemplate) return;
      
      const template = templates.find(t => t.slug === selectedTemplate);
      if (!template || !template.collectionId) return;

      try {
        const items = await webflowClient.getCollectionItems(template.collectionId, {
          limit: 10
        });
        setCollectionItems(items);
      } catch (err) {
        console.error('Failed to load collection items:', err);
      }
    };

    loadCollectionItems();
  }, [selectedTemplate, templates]);

  const handleGeneratePage = async () => {
    if (!selectedTemplate || !selectedItem) return;

    setLoading(true);
    setError('');
    setGeneratedPage(null);

    try {
      const template = templates.find(t => t.slug === selectedTemplate);
      if (!template) throw new Error('Template not found');

      const result = await webflowPageGenerator.generatePage(
        selectedTemplate,
        selectedItem,
        template.collectionId
      );

      if (result) {
        setGeneratedPage(result);
      } else {
        setError('Failed to generate page - no data returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate page');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterCustomTemplate = () => {
    // Example of registering a custom template
    const customTemplate: WebflowPageTemplate = {
      type: 'custom',
      name: 'Custom Landing Page',
      slug: 'custom-landing',
      template: {
        layout: 'landing',
        sections: [
          {
            type: 'hero',
            mapping: {
              title: 'custom-title',
              description: 'custom-description',
              image: { field: 'custom-image', transform: 'image' }
            },
            styling: {
              backgroundColor: 'blue',
              padding: 'xl'
            }
          },
          {
            type: 'content',
            mapping: {
              content: { field: 'custom-content', transform: 'rich-text' }
            },
            styling: {
              backgroundColor: 'white',
              padding: 'lg'
            }
          }
        ],
        seo: {
          title: { field: 'custom-title' },
          description: { field: 'custom-description' }
        }
      }
    };

    webflowPageGenerator.registerTemplate(customTemplate);
    setTemplates(webflowPageGenerator.getTemplates());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Generation Demo
          </h1>
          <p className="text-gray-600">
            Demonstrate automated page generation from Webflow data using templates
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration</h2>
            
            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a template...</option>
                {templates.map(template => (
                  <option key={template.slug} value={template.slug}>
                    {template.name} ({template.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Collection Item Selection */}
            {selectedTemplate && collectionItems.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Content Item
                </label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose an item...</option>
                  {collectionItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleGeneratePage}
                disabled={!selectedTemplate || !selectedItem || loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating...' : 'Generate Page'}
              </button>

              <button
                onClick={handleRegisterCustomTemplate}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Register Custom Template
              </button>
            </div>

            {/* Template Info */}
            {selectedTemplate && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Template Details</h3>
                {(() => {
                  const template = templates.find(t => t.slug === selectedTemplate);
                  if (!template) return null;
                  
                  return (
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Type:</strong> {template.type}</p>
                      <p><strong>Layout:</strong> {template.template.layout}</p>
                      <p><strong>Sections:</strong> {template.template.sections.length}</p>
                      {template.collectionId && (
                        <p><strong>Collection:</strong> {template.collectionId}</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generated Page</h2>
            
            {!generatedPage && (
              <div className="text-center py-12 text-gray-500">
                <p>Select a template and content item, then click "Generate Page" to see the results.</p>
              </div>
            )}

            {generatedPage && (
              <div className="space-y-6">
                {/* Metadata */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Metadata</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <p><strong>Title:</strong> {generatedPage.metadata.title}</p>
                    <p><strong>Description:</strong> {generatedPage.metadata.description}</p>
                    {generatedPage.metadata.openGraph && (
                      <p><strong>OG Type:</strong> {generatedPage.metadata.openGraph.type}</p>
                    )}
                  </div>
                </div>

                {/* Page Content */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Page Content</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <p><strong>Slug:</strong> {generatedPage.content.slug}</p>
                    <p><strong>Title:</strong> {generatedPage.content.title}</p>
                    <p><strong>Sections:</strong> {generatedPage.content.sections.length}</p>
                  </div>
                </div>

                {/* Sections */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Sections</h3>
                  <div className="space-y-3">
                    {generatedPage.content.sections.map((section: any, index: number) => (
                      <div key={section.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            Section {index + 1}: {section.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {section.styling?.backgroundColor || 'default'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>Data keys:</strong> {Object.keys(section.data).join(', ')}</p>
                          {section.data.title && (
                            <p><strong>Title:</strong> {String(section.data.title).substring(0, 100)}...</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw JSON */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Raw Data</h3>
                  <details className="bg-gray-50 p-4 rounded-lg">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700">
                      View JSON
                    </summary>
                    <pre className="mt-3 text-xs text-gray-600 overflow-auto">
                      {JSON.stringify(generatedPage, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Available Collections */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map(collection => (
              <div key={collection.id} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900">{collection.name}</h3>
                <p className="text-sm text-gray-600">Slug: {collection.slug}</p>
                <p className="text-sm text-gray-600">Fields: {collection.fields?.length || 0}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Available Templates */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <div key={template.slug} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600">Type: {template.type}</p>
                <p className="text-sm text-gray-600">Layout: {template.template.layout}</p>
                <p className="text-sm text-gray-600">Sections: {template.template.sections.length}</p>
                {template.collectionId && (
                  <p className="text-sm text-gray-600">Collection: {template.collectionId}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}