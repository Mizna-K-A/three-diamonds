import Property from '../../../../lib/models/Property';
import PropertyStatus from '../../../../lib/models/PropertyStatus';
import connectDB from '../../../../lib/mongodb';
import PropertyStatusClient from './PropertyStatusClient';

export async function getPropertyStatuses() {
    try {
        await connectDB();

        const statuses = await PropertyStatus.find({})
            .sort({ sortOrder: 1, name: 1 })
            .lean();

        return statuses.map(status => ({
            ...status,
            _id: status._id.toString(),
            id: status._id.toString(),
            createdAt: status.createdAt?.toISOString(),
            updatedAt: status.updatedAt?.toISOString(),
        }));
    } catch (error) {
        console.error('Error fetching property statuses:', error);
        return [];
    }
}

// Server Actions
async function createPropertyStatus(formData) {
    'use server';

    try {
        await connectDB();

        // Check if name or slug already exists
        const existing = await PropertyStatus.findOne({
            $or: [
                { name: formData.get('name') },
                { slug: formData.get('slug') }
            ]
        });

        if (existing) {
            return { error: 'Property status with this name or slug already exists' };
        }

        const status = await PropertyStatus.create({
            name: formData.get('name'),
            slug: formData.get('slug'),
            label: formData.get('label'),
            description: formData.get('description') || '',
            color: formData.get('color') || 'gray',
            icon: formData.get('icon') || '📌',
            isDefault: formData.get('isDefault') === 'true',
            isActive: formData.get('isActive') === 'true',
            sortOrder: parseInt(formData.get('sortOrder')) || 0,
        });

        return {
            success: true,
            data: {
                ...status.toObject(),
                _id: status._id.toString(),
                id: status._id.toString(),
            }
        };
    } catch (error) {
        console.error('Error creating property status:', error);
        return { error: error.message };
    }
}

async function updatePropertyStatus(id, formData) {
    'use server';

    try {
        await connectDB();

        // Check if name or slug already exists (excluding current)
        const existing = await PropertyStatus.findOne({
            $and: [
                { _id: { $ne: id } },
                {
                    $or: [
                        { name: formData.get('name') },
                        { slug: formData.get('slug') }
                    ]
                }
            ]
        });

        if (existing) {
            return { error: 'Property status with this name or slug already exists' };
        }

        // If setting this as default, unset any existing default
        if (formData.get('isDefault') === 'true') {
            await PropertyStatus.updateMany(
                { _id: { $ne: id }, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        const status = await PropertyStatus.findByIdAndUpdate(
            id,
            {
                name: formData.get('name'),
                slug: formData.get('slug'),
                label: formData.get('label'),
                description: formData.get('description') || '',
                color: formData.get('color'),
                icon: formData.get('icon'),
                isDefault: formData.get('isDefault') === 'true',
                isActive: formData.get('isActive') === 'true',
                sortOrder: parseInt(formData.get('sortOrder')) || 0,
                updatedAt: new Date(),
            },
            { new: true, runValidators: true }
        );

        if (!status) {
            return { error: 'Property status not found' };
        }

        return {
            success: true,
            data: {
                ...status.toObject(),
                _id: status._id.toString(),
                id: status._id.toString(),
            }
        };
    } catch (error) {
        console.error('Error updating property status:', error);
        return { error: error.message };
    }
}

async function deletePropertyStatus(id) {
    'use server';

    try {
        await connectDB();

        // Check if this is the default status
        const statusToDelete = await PropertyStatus.findById(id);
        if (statusToDelete?.isDefault) {
            return { error: 'Cannot delete the default status. Please set another status as default first.' };
        }

        // Check if status is being used by any properties
        // Property model is now imported at the top
        const propertiesCount = await Property.countDocuments({ statusId: id });

        if (propertiesCount > 0) {
            // Option 1: Prevent deletion
            return { error: `Cannot delete: ${propertiesCount} properties are using this status. Please update those properties first.` };

            // Option 2: Automatically reassign to default status (uncomment if preferred)
            // const defaultStatus = await PropertyStatus.findOne({ isDefault: true });
            // if (defaultStatus) {
            //   await Property.updateMany(
            //     { statusId: id },
            //     { $set: { statusId: defaultStatus._id } }
            //   );
            // } else {
            //   return { error: 'No default status found to reassign properties.' };
            // }
        }

        await PropertyStatus.findByIdAndDelete(id);

        return { success: true };
    } catch (error) {
        console.error('Error deleting property status:', error);
        return { error: error.message };
    }
}

export default async function PropertyStatusesPage() {
    const statuses = await getPropertyStatuses();

    return (
        <PropertyStatusClient
            initialStatuses={statuses}
            createPropertyStatus={createPropertyStatus}
            updatePropertyStatus={updatePropertyStatus}
            deletePropertyStatus={deletePropertyStatus}
        />
    );
}