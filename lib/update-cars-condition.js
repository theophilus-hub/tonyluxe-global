// Migration script to update existing cars with condition field
import connectToDatabase from './mongodb';
import Car from '../models/Car';

async function updateCarsWithCondition() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log('Finding cars without condition field...');
    const carsToUpdate = await Car.find({ condition: { $exists: false } });
    
    console.log(`Found ${carsToUpdate.length} cars to update.`);
    
    if (carsToUpdate.length === 0) {
      console.log('No cars need updating. All cars already have condition field.');
      return;
    }
    
    console.log('Updating cars with default condition "Used"...');
    const updateResult = await Car.updateMany(
      { condition: { $exists: false } },
      { $set: { condition: 'Used' } }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} cars successfully.`);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error updating cars:', error);
  } finally {
    process.exit(0);
  }
}

// Run the migration
updateCarsWithCondition();
